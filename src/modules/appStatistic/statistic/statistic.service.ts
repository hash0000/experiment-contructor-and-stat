import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule/dist/enums/cron-expression.enum';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import * as minMax from 'dayjs/plugin/minMax';
import { Response } from 'express';
import * as fs from 'fs';
import { createReadStream } from 'fs';
import { ensureDir, writeFile } from 'fs-extra';
import { find } from 'lodash';
import mongoose, { Model } from 'mongoose';
import * as path from 'path';
import { CustomErrorTypeEnum } from 'src/common/enums/errorType.enum';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { CustomResponseType } from 'src/common/types/customResponseType';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx-color';
import { PostgresDataSource } from '../../../common/configs/typeorm.config';
import { ExperimentEntity } from '../../app/database/entities/postgres/experiment.entity';
import { UserSexEnum } from '../../app/database/entities/postgres/user.entity';
import { Statistic, StatisticDocument } from '../database/entities/statistic.entity';
import { FinishExperimentDto } from './dto/finishExperiment.dto';
import { StartNextSlideDto } from './dto/startNextSlide.dto';
import { UpdateStatisticDataDto } from './dto/updateStatisticData.dto';

@Injectable()
export class StatisticService {
  constructor(
    @InjectModel(Statistic.name) private readonly statisticModel: Model<StatisticDocument>,
    @InjectRepository(ExperimentEntity)
    private readonly experimentsRepository: Repository<ExperimentEntity>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  public async startNextSlide(dto: StartNextSlideDto, sessionId: string): Promise<CustomResponseType> {
    const session = await this.statisticModel
      .findOne(
        { _id: sessionId, finished: false },
        {
          _id: true,
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
    const currentSlideData = find(session.statistics, { slideId: dto.slideId });
    if (!currentSlideData) {
      throw new CustomException({
        statusCode: HttpStatus.NOT_FOUND,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    let passingPosition = 1;

    if (dto?.previousSlideId) {
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

      const answers = previousSlide.data.map((el) => {
        if (el.isAnswer) return el;
      });

      dayjs.extend(minMax);
      const maxResponseTime = dayjs.max(answers.map((el) => dayjs(el?.jsTimestamp)));

      passingPosition = passingPosition + previousSlide.passingPosition;

      await this.statisticModel.updateOne(
        {
          _id: sessionId,
          statistics: {
            $elemMatch: { slideId: previousSlide.slideId },
          },
        },
        {
          'statistics.$.inSlideDuration': dayjs(dto.jsStartTimestamp).diff(dayjs(previousSlide.jsStartTimestamp), 'second'),
          'statistics.$.answerTime': dayjs(dto.jsStartTimestamp).diff(dayjs(maxResponseTime), 'second') || null,
          'statistics.$.answers': answers.map((el) => el?.value) || null,
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

    const answers = previousSlide.data.map((el) => {
      if (el.isAnswer) return el;
    });

    dayjs.extend(minMax);
    const maxResponseTime = dayjs.max(answers.map((el) => dayjs(el?.jsTimestamp)));

    const postgresQueryRunner = PostgresDataSource.createQueryRunner();
    const mongoTransactionSession = await this.connection.startSession();

    try {
      await postgresQueryRunner.connect().then(async () => await postgresQueryRunner.startTransaction());
      await mongoTransactionSession.startTransaction();

      await this.statisticModel
        .updateOne(
          {
            _id: sessionId,
            statistics: {
              $elemMatch: { slideId: previousSlide.slideId },
            },
          },
          {
            'statistics.$.inSlideDuration': dayjs(dto.jsFinishTimestamp).diff(dayjs(previousSlide.jsStartTimestamp), 'second'),
            'statistics.$.answerTime': dayjs(dto.jsFinishTimestamp).diff(dayjs(maxResponseTime), 'second') || null,
            'statistics.$.answers': answers.map((el) => el?.value) || null,
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

      const usersEnded: number = (
        await this.experimentsRepository.findOne({
          where: { id: session.experimentId },
          select: { id: true, usersEnded: true },
        })
      )?.usersEnded;

      if (usersEnded === undefined) {
        throw new Error();
      }

      await postgresQueryRunner.manager.update(ExperimentEntity, { id: session.experimentId }, { usersEnded: usersEnded + 1 });

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
    switch (sex) {
      case UserSexEnum.NOT_KNOWN:
        return 'не указано';
      case UserSexEnum.MALE:
        return 'мужской';
      case UserSexEnum.FEMALE:
        return 'женский';
      default:
        return '';
    }
  }

  public async exportToExcel(experimentId: string, res: Response) {
    const sessions = await this.statisticModel.find({ experimentId }).exec();
    if (!sessions?.length) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const excelArr = [
      [
        'Имя',
        'Фамилия',
        'Отчество',
        'Пол',
        'Эл. почта',
        'Телефон',
        'День рождения',
        'Родной(ые) язык(и)',
        'Выученный(ые) язык(и)',
        'Дополнительные вопросы',
        'Запрашиваемые данные об эксперименте',
      ],
    ];

    const headerArr: string[] = [];
    for (const el of sessions[0].statistics) {
      headerArr.push(`Слайд: ${el.slideTitle} ${el.isTraining ? '(тренировочный)' : ''}`, `Время нахождения на слайде: ${el.slideTitle}`);
    }
    excelArr[0].push(...headerArr);

    for (const el of sessions) {
      const sessionDataArray: string[] = [
        el.respondent.firstName || '-',
        el.respondent.lastName || '-',
        el.respondent.middleName || '-',
        el.respondent.sex ? this.getSexStringFromEnum(Number(el.respondent.sex)) : '-',
        el.respondent.email || '-',
        el.respondent.phone || '-',
        el.respondent.birthday ? el.respondent.birthday.toISOString().split('T')[0] : '-',
        el.respondent.nativeLanguages.join(', ') || '-',
        el.respondent.learnedLanguages.join(', ') || '-',
        el.respondent.requestedQuestions.join(', ') || '-',
        el.respondent.requestedParametersRespondentData.join(', ') || '-',
      ];
      for (const elem of el.statistics) {
        const value = elem.answers.join(', ') || 'нет ответа';
        const answerTime = elem.answerTime ? `${elem.answerTime} сек.` : '-';
        sessionDataArray.push(value, answerTime);
      }
      excelArr.push(sessionDataArray);
    }

    const ws = XLSX.utils.aoa_to_sheet(excelArr);
    const wb = XLSX.utils.book_new();

    const HEADER_ROW = 1;
    const RANGE = XLSX.utils.decode_range(ws['!ref']);
    for (let index = 0; index <= RANGE.e.c; index++) {
      ws[XLSX.utils.encode_col(index) + HEADER_ROW].s = {
        font: { bold: true, size: 10 },
        fill: { patternType: 'solid', fgColor: { rgb: 'DFDBC6' } },
        border: {
          bottom: { style: 'medium' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        },
      };
      const columnWidth = { wpx: 250 };

      ws['!cols'] = ws['!cols'] || [];
      ws['!cols'][index] = columnWidth;
    }

    XLSX.utils.book_append_sheet(wb, ws, sessions[0].experimentTitle);

    const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace(/:/g, '-');
    const fileName = `${sessions[0].experimentTitle}-${formattedDate}.xlsx`.replace(/ /g, '-');

    const folder = path.join(__dirname, '../../../static/xlsx');
    await ensureDir(folder);
    const filePath = path.join(folder, fileName);
    await writeFile(filePath, new Uint8Array(buffer));

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  public async cleanupFiles() {
    const folder = path.join(__dirname, '../../../static/xlsx');
    if (!fs.existsSync(folder)) {
      return;
    }
    const files = fs.readdirSync(folder);
    if (!files) {
      return;
    }

    const currentDate = new Date();

    files.forEach((fileName) => {
      const fileTime = this.extractFileTimeFromName(fileName);

      if (fileTime) {
        const differenceInTime = currentDate.getTime() - fileTime.getTime();
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
        if (differenceInTime >= oneDayInMilliseconds) {
          const filePath = path.join(folder, fileName);
          fs.unlinkSync(filePath);
        }
      }
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async deleteUnrealizedSessions() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return await this.statisticModel.deleteMany({ finished: false, createdAt: { $lt: oneDayAgo } }).exec();
  }

  private extractFileTimeFromName(fileName: string): Date | null {
    const pattern = /(\d{4}-\d{2}-\d{2})T\d{2}-\d{2}-\d{2}.\d{3}Z/;
    const match = fileName.match(pattern);

    if (match) {
      const fileTime = match[1];
      return new Date(fileTime);
    }

    return null;
  }
}
