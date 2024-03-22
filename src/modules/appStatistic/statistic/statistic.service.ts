import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule/dist/enums/cron-expression.enum';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import * as ruLocale from 'dayjs/locale/ru';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import * as minMax from 'dayjs/plugin/minMax';
import { Response } from 'express';
import { ensureDir, writeFile } from 'fs-extra';
import { find } from 'lodash';
import mongoose, { Model } from 'mongoose';
import { createReadStream, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { CustomErrorTypeEnum } from 'src/common/enums/errorType.enum';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { CustomResponseType } from 'src/common/types/customResponseType';
import { Repository } from 'typeorm';
import { WorkBook, utils, write } from 'xlsx-color';
import { PostgresDataSource } from '../../../common/configs/typeorm.config';
import { ExperimentEntity } from '../../app/database/entities/postgres/experiment.entity';
import { UserSexEnum } from '../../app/database/entities/postgres/user.entity';
import { Statistic, StatisticDocument, StatisticsData } from '../database/entities/statistic.entity';
import { FinishExperimentDto } from './dto/finishExperiment.dto';
import { StartNextSlideDto } from './dto/startNextSlide.dto';
import { UpdateStatisticDataDto } from './dto/updateStatisticData.dto';
import { StatisticRepository } from './statistic.repository';

@Injectable()
export class StatisticService {
  constructor(
    @InjectModel(Statistic.name) private readonly statisticModel: Model<StatisticDocument>,
    @InjectRepository(ExperimentEntity)
    private readonly experimentsRepository: Repository<ExperimentEntity>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly statisticRep: StatisticRepository,
  ) {}

  public async startNextSlide(dto: StartNextSlideDto, sessionId: string): Promise<CustomResponseType> {
    const countSession = await this.statisticRep.countNotFinishedById(sessionId);
    if (countSession === 0) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const currentSlideData = await this.statisticRep.findByIdForNextSlide(sessionId, dto.slideId);
    if (currentSlideData === null) {
      throw new CustomException({
        statusCode: HttpStatus.NOT_FOUND,
        errorTypeCode: CustomErrorTypeEnum.NO_DATA_FOR_CURRENT_SLIDE,
      });
    }

    let passingPosition = 1;

    if (dto?.previousSlideId !== undefined) {
      const previousSlide = await this.statisticRep.findByIdForNextSlide(sessionId, dto.previousSlideId);
      if (previousSlide === null) {
        throw new CustomException({
          statusCode: HttpStatus.NOT_FOUND,
          errorTypeCode: CustomErrorTypeEnum.NO_DATA_FOR_PREVIOUS_SLIDE,
        });
      }

      if (previousSlide.statistics?.jsStartTimestamp === undefined || previousSlide.statistics?.jsStartTimestamp === null) {
        throw new CustomException({
          statusCode: HttpStatus.NOT_FOUND,
          errorTypeCode: CustomErrorTypeEnum.NO_DATA_FOR_START_TIME_PREVIOUS_SLIDE,
        });
      }

      const dataForAnswers = previousSlide.statistics.data.filter((el) => {
        return el;
      });

      const answers = await this.filteredAnswers(dataForAnswers);

      dayjs.extend(minMax);
      const maxResponseTime = dayjs.max(dataForAnswers.map((el) => dayjs(el?.jsTimestamp)));

      passingPosition = passingPosition + previousSlide.statistics.passingPosition;

      if (currentSlideData.statistics.isChild === true) {
        await this.statisticModel.updateOne(
          {
            _id: sessionId,
            statistics: {
              $elemMatch: { slideId: dto.slideId },
            },
          },
          {
            $push: {
              'statistics.$.inSlideDurationInCycle': dayjs(dto.jsStartTimestamp).diff(dayjs(previousSlide.statistics.jsStartTimestamp), 'milliseconds'),
            },
          },
        );
      }

      await this.statisticModel.updateOne(
        {
          _id: sessionId,
          statistics: {
            $elemMatch: { slideId: previousSlide.statistics.slideId },
          },
        },
        {
          'statistics.$.inSlideDuration': dayjs(dto.jsStartTimestamp).diff(dayjs(previousSlide.statistics.jsStartTimestamp), 'milliseconds'),
          'statistics.$.answerTime': dayjs(dto.jsStartTimestamp).diff(dayjs(maxResponseTime), 'second') || null,
          'statistics.$.answers': answers.map((item) => item),
        },
      );
    }

    await this.statisticModel.updateOne(
      {
        _id: sessionId,
        statistics: {
          $elemMatch: { slideId: dto.slideId },
        },
      },
      { 'statistics.$.jsStartTimestamp': dto.jsStartTimestamp, 'statistics.$.passingPosition': passingPosition },
    );

    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async updateStatisticData(dto: UpdateStatisticDataDto, sessionId: string, slideId: string): Promise<CustomResponseType> {
    const session = await this.statisticModel
      .findOne(
        { _id: sessionId, finished: false },
        {
          _id: true,
          createdAt: true,
        },
      )
      .exec();
    if (!session) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    await this.statisticModel.updateOne(
      {
        _id: sessionId,
        statistics: {
          $elemMatch: { slideId: slideId },
        },
      },
      { $push: { 'statistics.$.data': dto } },
    );

    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async finishExperiment(dto: FinishExperimentDto, sessionId: string): Promise<CustomResponseType> {
    const session = await this.statisticModel
      .findOne(
        { _id: sessionId, finished: false },
        {
          _id: true,
          experimentId: true,
          jsStartTimestamp: true,
          jsFinishTimestamp: true,
          statistics: { slideId: true, jsStartTimestamp: true, data: true, passingPosition: true },
        },
      )
      .exec();
    if (!session) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const previousSlide = find(session.statistics, { slideId: dto.previousSlideId });
    if (!previousSlide) {
      throw new CustomException({
        statusCode: HttpStatus.NOT_FOUND,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }
    if (!previousSlide.jsStartTimestamp) {
      throw new CustomException({
        statusCode: HttpStatus.NOT_FOUND,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const dataForAnswers = previousSlide.data.filter((el) => {
      if (el.isAnswer) return el;
    });

    let answers = [];
    if (dataForAnswers) {
      answers = await this.filteredAnswers(dataForAnswers);
    }

    dayjs.extend(minMax);
    const maxResponseTime = dayjs.max(dataForAnswers.map((el) => dayjs(el?.jsTimestamp)));

    const postgresQueryRunner = PostgresDataSource.createQueryRunner();
    const mongoTransactionSession = await this.connection.startSession();
    const totalInSlideDuration = dayjs(dto.jsFinishTimestamp).diff(dayjs(session.jsStartTimestamp), 'second');
    try {
      await postgresQueryRunner.connect().then(async () => await postgresQueryRunner.startTransaction());
      await mongoTransactionSession.startTransaction();

      if (previousSlide.isChild) {
        await this.statisticModel
          .updateOne(
            {
              _id: sessionId,
              statistics: {
                $elemMatch: { slideId: previousSlide.slideId },
              },
            },
            {
              $push: { 'statistics.$.inSlideDurationInCycle': dayjs(dto.jsFinishTimestamp).diff(dayjs(previousSlide.jsStartTimestamp), 'milliseconds') },
            },
          )
          .session(mongoTransactionSession);
      }

      await this.statisticModel
        .updateOne(
          {
            _id: sessionId,
            statistics: {
              $elemMatch: { slideId: previousSlide.slideId },
            },
          },
          {
            'statistics.$.inSlideDuration': dayjs(dto.jsFinishTimestamp).diff(dayjs(previousSlide.jsStartTimestamp), 'milliseconds'),
            'statistics.$.answerTime': dayjs(dto.jsFinishTimestamp).diff(dayjs(maxResponseTime), 'second') || null,
            'statistics.$.answers': answers.map((el) => el),
          },
        )
        .session(mongoTransactionSession);

      await this.statisticModel
        .updateOne(
          {
            _id: sessionId,
          },
          { finished: true, jsFinishTimestamp: dto.jsFinishTimestamp },
        )
        .session(mongoTransactionSession);

      const experimentForUsersEnded: ExperimentEntity = await this.experimentsRepository.findOne({
        where: { id: session.experimentId },
        select: { id: true, usersEnded: true, allTimePassing: true },
      });

      if (experimentForUsersEnded.usersEnded === undefined) {
        throw new Error();
      }

      const allTimePassing: number = experimentForUsersEnded.allTimePassing + totalInSlideDuration;

      await postgresQueryRunner.manager.update(
        ExperimentEntity,
        { id: session.experimentId },
        { usersEnded: experimentForUsersEnded.usersEnded + 1, allTimePassing: allTimePassing },
      );

      const experimentForPassageTime = await postgresQueryRunner.manager.findOne(ExperimentEntity, {
        where: { id: session.experimentId },
        select: { id: true, usersEnded: true, allTimePassing: true, averagePassageTime: true },
      });

      const averagePassageTime: number = Math.round(experimentForPassageTime.allTimePassing / experimentForPassageTime.usersEnded);

      await postgresQueryRunner.manager.update(ExperimentEntity, { id: session.experimentId }, { averagePassageTime: averagePassageTime });

      await postgresQueryRunner.commitTransaction();
      await mongoTransactionSession.commitTransaction();

      return {
        statusCode: HttpStatus.OK,
      };
    } catch (e) {
      await postgresQueryRunner.rollbackTransaction();
      await mongoTransactionSession.abortTransaction();

      console.log(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } finally {
      await postgresQueryRunner.release();
      await mongoTransactionSession.endSession();
    }
  }

  public getSexStringFromEnum(sex: UserSexEnum): string {
    if (sex == UserSexEnum.MALE) {
      return 'мужской';
    } else if (sex == UserSexEnum.FEMALE) {
      return 'женский';
    } else if (sex == UserSexEnum.NOT_KNOWN) {
      return 'не указано';
    } else {
      return '';
    }
  }

  public async exportToExcel(experimentId: string, res: Response) {
    const statisticArr = await this.statisticRep.selectStatisticForExcel(experimentId);

    if (statisticArr.length === 0) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const workBook = utils.book_new();

    const firstExcelColumn = await this.getArraysDataForExcel(statisticArr[0]);
    utils.book_append_sheet(workBook, utils.aoa_to_sheet(firstExcelColumn));

    const workSheet = workBook.Sheets[workBook.SheetNames[0]];

    workSheet['!cols'] = Array.from({ length: 500 }, () => {
      return { wpx: 250 };
    });

    for await (const el of statisticArr.slice(1)) {
      const excelRowArr = await this.getArraysDataForExcel(el);

      utils.sheet_add_aoa(workSheet, [Array.from({ length: 500 }, () => '')], {
        origin: -1,
      });

      utils.sheet_add_aoa(workSheet, excelRowArr, { origin: -1 });
    }

    const experimentTitle = statisticArr.at(-1).experimentTitle;

    return await this.saveExcelFile(workBook, experimentTitle, res);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async deleteUnrealizedSessions() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return await this.statisticModel.deleteMany({ finished: false, createdAt: { $lt: oneDayAgo } }).exec();
  }

  public async clearAllSessions() {
    return this.statisticModel.deleteMany({});
  }

  private async filteredAnswers(answers: StatisticsData[]) {
    const answersMap = new Map();

    answers.forEach(({ variableText, value, elementTitle, jsTimestamp }) => {
      if (!answersMap.has(variableText)) {
        answersMap.set(variableText, []);
      }

      const existingValues = answersMap.get(variableText);
      const sameElement = existingValues.find((item) => item.elementTitle === elementTitle);

      if (sameElement) {
        if (jsTimestamp > sameElement.jsTimestamp) {
          sameElement.value = value;
          sameElement.jsTimestamp = jsTimestamp;
        }
      } else {
        existingValues.push({ elementTitle, value, jsTimestamp });
      }
    });

    return Array.from(answersMap, ([variableText, values]) => ({
      variable: variableText,
      answers: values.map((valueObj) => valueObj.value),
    }));
  }

  private async getArraysDataForExcel(sessions: StatisticDocument) {
    const excelArr: string[][] = [];

    const header: string[] = [
      'debug',
      'Начало прохождения',
      'Конец прохождения',
      'Имя',
      'Фамилия',
      'Отчество',
      'Пол',
      'Эл.почта',
      'Телефон',
      'День рождения',
      'Родной(ые) язык(и)',
      'Выученный(ые) язык(и)',
      'Дополнительные вопросы',
      'Запрашиваемые данные об эксперименте',
    ];

    dayjs.extend(localizedFormat);
    dayjs.locale(ruLocale);

    const sessionDataArray: string[] = [
      String(sessions._id),
      String(dayjs(new Date(sessions.jsStartTimestamp)).format('dd, DD MMM YYYY HH:mm:ss')) || '-',
      sessions.jsFinishTimestamp ? String(dayjs(new Date(sessions.jsFinishTimestamp)).format('dd, DD MMM YYYY HH:mm:ss')) : '-',
      sessions.respondent.firstName || '-',
      sessions.respondent.lastName || '-',
      sessions.respondent.middleName || '-',
      sessions.respondent.sex ? this.getSexStringFromEnum(Number(sessions.respondent.sex)) : '-',
      sessions.respondent.email || '-',
      sessions.respondent.phone || '-',
      sessions.respondent.birthday ? sessions.respondent.birthday.toISOString().split('T')[0] : '-',
      sessions.respondent.nativeLanguages.join(', ') || '-',
      sessions.respondent.learnedLanguages.join(', ') || '-',
      sessions.respondent.requestedQuestions.join(', ') || '-',
      sessions.respondent.requestedParametersRespondentData.join(', ') || '-',
    ];

    for (const el of sessions.statistics) {
      if (el.answers.length > 0) {
        for (const [index, elem] of el.answers.entries()) {
          header.push(`Слайд: ${el.slideTitle} ${el.isTraining ? '(тренировочный)' : ''}`.trim()); // answers
          header.push('Переменная'); // variable
          header.push(`Время нахождения на слайде: ${el.slideTitle}`.trim()); // in slide duration

          if (elem.answers.length > 1) {
            sessionDataArray.push(elem.answers.join('; '));
          } else if (elem.answers.length === 1) {
            sessionDataArray.push(elem.answers[0]);
          }

          sessionDataArray.push(elem.variable);

          const inSlideDuration = el.isChild
            ? el.inSlideDurationInCycle.length
              ? `${(el.inSlideDurationInCycle[index] / 1000).toFixed(3)} сек`
              : '-'
            : el.inSlideDuration
              ? `${(el.inSlideDuration / 1000).toFixed(3)} сек`
              : '-';

          sessionDataArray.push(inSlideDuration);
        }
      } else {
        header.push(`Слайд: ${el.slideTitle} ${el.isTraining ? '(тренировочный)' : ''}`.trim()); // answers
        header.push('Переменная'); // variable
        header.push(`Время нахождения на слайде: ${el.slideTitle}`.trim()); // in slide duration

        sessionDataArray.push('-');

        sessionDataArray.push('-');

        const inSlideDuration = el.inSlideDuration ? `${(el.inSlideDuration / 1000).toFixed(3)} сек` : '-';
        sessionDataArray.push(inSlideDuration);
      }
    }

    excelArr.push(header);
    excelArr.push(sessionDataArray);

    return excelArr;
  }

  private async saveExcelFile(wb: WorkBook, experimentTitle: string, res: Response) {
    const buffer = write(wb, { type: 'array', bookType: 'xlsx' });

    const fileName = `${experimentTitle}-${new Date().toLocaleDateString('ru-RU')}.xlsx`.replace(/ /g, '-');

    const folder = join(__dirname, '../../../static/xlsx');
    await ensureDir(folder);

    const filePath = join(folder, fileName);
    await writeFile(filePath, new Uint8Array(buffer));

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    const fileStream = createReadStream(filePath);

    fileStream.pipe(res);

    fileStream.on('end', async () => {
      try {
        unlinkSync(filePath);
      } catch (e) {
        console.log(e);
        throw new CustomException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    });
  }
}
