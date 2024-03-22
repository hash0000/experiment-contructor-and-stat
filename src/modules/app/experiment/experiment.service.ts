import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import * as lod from 'lodash';
import { find } from 'lodash';
import mongoose, { Model } from 'mongoose';
import { CustomResponseType } from 'src/common/types/customResponseType';
import { isEmptyObject } from 'src/common/validators/isEmptyObject.validator';
import { isUniqueExperimentColumnForUserValidator } from 'src/common/validators/isUniqueExperimentColumnForUser.validator';
import { Variable, VariableDocument } from 'src/modules/app/database/entities/mongo/variable.schema';
import {
  accessConditionsConditionEnum,
  accessConditionsOperatorEnum,
  ExperimentEntity,
  ExperimentSortOptionEnum,
  ExperimentStatusEnum,
  RequestedParametersRespondentDataType,
} from 'src/modules/app/database/entities/postgres/experiment.entity';
import { cycleChildEntityBaseSelectOptions, SlideEntity, slideEntityBaseSelectOptions } from 'src/modules/app/database/entities/postgres/slide.entity';
import { UserSexEnum } from 'src/modules/app/database/entities/postgres/user.entity';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { PostgresDataSource } from '../../../common/configs/typeorm.config';
import { CustomErrorTypeEnum, ValidationErrorTypeEnum } from '../../../common/enums/errorType.enum';
import { CustomException } from '../../../common/exceptions/custom.exception';
import checkIsExists from '../../../common/functions/checkIsExists.function';
import checkIsUpdated from '../../../common/functions/checkIsUpdated.function';
import { Statistic, StatisticDocument } from '../../appStatistic/database/entities/statistic.entity';
import { LanguageEntity } from '../database/entities/postgres/language.entity';
import { CreateExperimentDto } from './dto/createExperiment.dto';
import { ReadExperimentsDto } from './dto/readExperiments.dto';
import { StartExperimentDto } from './dto/startExperiment.dto';
import { StartExperimentPreviewDto } from './dto/startExperimentPreview.dto';
import { UpdateExperimentDto } from './dto/updateExperiment.dto';
import { UpdateExperimentStatusDto } from './dto/updateExperimentStatus.dto';

@Injectable()
export class ExperimentService {
  constructor(
    @InjectModel(Variable.name) private readonly variableModel: Model<VariableDocument>,
    @InjectModel(Statistic.name, 'statistic') private readonly statisticModel: Model<StatisticDocument>,
    @InjectRepository(ExperimentEntity)
    private readonly experimentsRepository: Repository<ExperimentEntity>,
    @InjectRepository(SlideEntity)
    private readonly slidesRepository: Repository<SlideEntity>,
    @InjectRepository(LanguageEntity)
    private readonly languagesRepository: Repository<LanguageEntity>,
    @InjectConnection('statistic') private readonly connection: mongoose.Connection,
  ) {}

  public async createExperiment(dto: CreateExperimentDto, userId: string): Promise<CustomResponseType> {
    await isUniqueExperimentColumnForUserValidator(dto.title, 'title', userId);
    const { identifiers } = await this.experimentsRepository.insert({ creators: dto.creators, user: { id: userId }, ...dto });
    await this.slidesRepository.insert({
      title: 'Slide 1',
      position: 1,
      experiment: { id: identifiers[0].id },
    });
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.getExperimentById(identifiers[0].id, 3),
    };
  }

  public async updateExperiment(dto: UpdateExperimentDto, experimentId: string, userId: string): Promise<CustomResponseType> {
    isEmptyObject(dto);
    await checkIsExists('Experiment', experimentId);
    await isUniqueExperimentColumnForUserValidator(dto.title, 'title', userId, experimentId, true);
    if (!!dto?.requestedParametersRespondentData && dto?.requestedParametersRespondentData.length > 0) {
      for (const item of dto.requestedParametersRespondentData) {
        const variableModel = await this.variableModel.findOne({ _id: item.variableId, 'columns._id': item.attributeId }).select({ _id: true }).exec();
        if (!variableModel) {
          throw new CustomException({
            statusCode: HttpStatus.NOT_FOUND,
            errorTypeCode: CustomErrorTypeEnum.VARIABLE_NOT_FOUND,
          });
        }
      }
    }
    try {
      checkIsUpdated(await this.experimentsRepository.update(experimentId, dto));
      return await this.readExperimentById(experimentId, true);
    } catch (e) {
      console.log(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  public async readExperiments(page: number, dtoQuery: ReadExperimentsDto, userId?: string): Promise<CustomResponseType> {
    const whereOption: FindOptionsWhere<ExperimentEntity> = {};
    const queryDataTotalCount: FindManyOptions<ExperimentEntity> = {
      select: {
        id: true,
      },
    };
    const queryData: FindManyOptions<ExperimentEntity> = {
      relations: {
        user: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        requestedBasicRespondentData: {
          firstName: true,
          lastName: true,
          birthday: true,
          sex: true,
          email: true,
          phone: true,
          nativeLanguages: true,
          learnedLanguages: true,
        },
        accessConditions: true,
        requestedParametersRespondentData: true,
        requestedQuestions: true,
        creators: true,
        status: true,
        usersStarted: true,
        usersEnded: true,
        platform: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          avatarUrl: true,
          firstName: true,
          lastName: true,
          middleName: true,
        },
      },
      take: 10,
      skip: (page - 1) * 10,
    };

    if (dtoQuery.sortBy === ExperimentSortOptionEnum.ALPHABETICAL) {
      queryData.order = { title: dtoQuery.order };
    } else {
      queryData.order = { createdAt: dtoQuery.order };
    }

    if (!!dtoQuery.query) {
      whereOption.title = ILike(`%${dtoQuery.query}%`);
    }
    if (!!userId && !!dtoQuery.experimentStatus) {
      whereOption.user = {
        id: userId,
      };
      whereOption.status = dtoQuery.experimentStatus;
    } else if (!!userId) {
      whereOption.user = {
        id: userId,
      };
    } else {
      whereOption.status = ExperimentStatusEnum.PUBLISHED;
    }
    queryData.where = whereOption;
    queryDataTotalCount.where = whereOption;

    const experiments = await this.experimentsRepository.find(queryData);
    const variableIds = experiments.flatMap((experiment) => experiment.requestedParametersRespondentData.map((item) => item.variableId));
    const variables = await this.variableModel.find({ _id: { $in: variableIds } });

    experiments.forEach((experiment) => {
      experiment.requestedParametersRespondentData.forEach((data, index) => {
        const variable = variables.find((v) => v._id.toString() === data.variableId);
        if (variable) {
          experiment.requestedParametersRespondentData[index] = {
            ...data,
            columns: variable.columns,
          } as RequestedParametersRespondentDataType;
        }
      });
    });

    return {
      statusCode: HttpStatus.OK,
      data: {
        total: await this.experimentsRepository.count(queryDataTotalCount),
        experiments: experiments.map((el) => {
          delete el.user.id;
          return el;
        }),
      },
    };
  }

  public async readExperimentById(id: string, defaultFormat: boolean, isShouldSlides: '0' | '1' | boolean = true): Promise<CustomResponseType> {
    let experimentEntity: ExperimentEntity;
    if (defaultFormat === true) {
      experimentEntity = await this.getExperimentById(id);
    } else {
      if (isShouldSlides === true || isShouldSlides === '1') {
        experimentEntity = await this.getExperimentById(id, 3);
      } else {
        experimentEntity = await this.getExperimentById(id, 4);
      }
    }
    if (!experimentEntity) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    for (const [index, param] of experimentEntity.requestedParametersRespondentData.entries()) {
      const variableId = param.variableId;
      const variable = await this.variableModel.findOne({ _id: variableId });

      if (variable) {
        experimentEntity.requestedParametersRespondentData[index] = { ...param, columns: variable.columns } as RequestedParametersRespondentDataType;
      }
    }

    return {
      statusCode: HttpStatus.OK,
      data: {
        experiment: { ...experimentEntity },
      },
    };
  }

  public async startExperiment(dto: StartExperimentDto, experimentId: string): Promise<CustomResponseType> {
    const experimentEntity = await this.getExperimentById(experimentId, 1);

    if (!experimentEntity) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    if (dto?.sessionId) {
      const mongoTransactionSession = await this.connection.startSession();

      try {
        await mongoTransactionSession.startTransaction();

        const sessionEntity = await this.statisticModel
          .findOne(
            { _id: dto.sessionId, experimentId, finished: false },
            {
              _id: true,
              statistics: true,
            },
          )
          .exec();

        if (!sessionEntity) {
          throw CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND;
        }

        const lastSlide = find(sessionEntity.statistics, {
          passingPosition: Math.max(...sessionEntity.statistics.map(({ passingPosition }) => passingPosition)),
        });

        await this.statisticModel
          .updateOne(
            {
              _id: dto.sessionId,
              finished: false,
              statistics: {
                $elemMatch: { slideId: lastSlide?.slideId },
              },
            },
            {
              'statistics.$.data': [],
            },
          )
          .session(mongoTransactionSession)
          .exec();

        const experimentEntityForStart = await this.getExperimentById(experimentId, 2);
        const variableEntityArray = await this.prepareVariablesForStart(experimentEntity, dto);
        // TODO:  Cannot call abortTransaction after calling commitTransaction
        await mongoTransactionSession.commitTransaction();

        return {
          statusCode: HttpStatus.OK,
          data: {
            experiment: experimentEntityForStart,
            variables: variableEntityArray,
            sessionId: sessionEntity._id,
            lastSlideId: lastSlide?.slideId || null,
          },
        };
      } catch (e) {
        await mongoTransactionSession.abortTransaction();

        if (e === CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND) {
          throw new CustomException({
            statusCode: HttpStatus.FORBIDDEN,
            errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
          });
        }

        console.error(e);
        console.trace();
        throw new CustomException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      } finally {
        await mongoTransactionSession.endSession();
      }
    }
    this.validateStartExperimentData(dto, experimentEntity);
    this.checkExperimentAccess(experimentEntity.accessConditions, dto);

    const postgresQueryRunner = PostgresDataSource.createQueryRunner();
    await postgresQueryRunner.connect();
    await postgresQueryRunner.startTransaction();

    try {
      const experimentEntityForStart = await this.getExperimentById(experimentEntity.id, 2);
      let slidePosCounter = 1;

      let nativeLanguages: LanguageEntity[];
      let learnedLanguages: LanguageEntity[];
      let requestedParametersRespondentData: string[];
      let requestedQuestions: string[];

      if (dto?.nativeLanguages) {
        nativeLanguages = await this.languagesRepository.find({
          where: { id: In(dto.nativeLanguages) },
          select: { id: true, title: true, region: true },
        });
      }
      if (dto?.learnedLanguages) {
        learnedLanguages = await this.languagesRepository.find({
          where: { id: In(dto.learnedLanguages) },
          select: { id: true, title: true, region: true },
        });
      }
      if (dto?.requestedParametersRespondentData) {
        requestedParametersRespondentData = dto.requestedParametersRespondentData.map(
          (el) => `${lod.find(experimentEntity.requestedParametersRespondentData, { id: el.id }).title}: ${el.value}`,
        );
      }
      if (dto?.requestedQuestions) {
        requestedQuestions = dto.requestedQuestions.map((el) => `${lod.find(experimentEntity.requestedQuestions, { id: el.id }).question}: ${el.answers}`);
      }

      const sessionEntity = await new this.statisticModel({
        experimentId: experimentEntity.id,
        ownerId: experimentEntity.user.id,
        experimentTitle: experimentEntity.title,
        jsStartTimestamp: dto.jsStartTimestamp,
        respondent: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          birthday: dto.birthday,
          sex: dto.sex,
          email: dto.email,
          phone: dto.phone,
          nativeLanguages: nativeLanguages?.map((el) => `${el.title} (${el.region})`),
          learnedLanguages: learnedLanguages?.map((el) => `${el.title} (${el.region})`),
          requestedParametersRespondentData: requestedParametersRespondentData,
          requestedQuestions: requestedQuestions,
        },
        statistics: experimentEntityForStart.slides.flatMap((el) => {
          const res = [{ slideId: el.id, slideTitle: el.title, isTraining: el.training, constructorPosition: slidePosCounter++, isChild: false }];
          for (const elem of el?.children) {
            res.push({ slideId: elem.id, slideTitle: elem.title, isTraining: elem.training, constructorPosition: slidePosCounter++, isChild: true });
          }
          return res;
        }),
      }).save();

      const variableEntityArray = await this.prepareVariablesForStart(experimentEntity, dto);

      await postgresQueryRunner.manager.update(ExperimentEntity, { id: experimentId }, { usersStarted: experimentEntity.usersStarted + 1 });

      await postgresQueryRunner.commitTransaction();

      return {
        statusCode: HttpStatus.OK,
        data: {
          experiment: experimentEntityForStart,
          variables: variableEntityArray,
          sessionId: sessionEntity._id,
        },
      };
    } catch (e) {
      await postgresQueryRunner.rollbackTransaction();

      console.error(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } finally {
      await postgresQueryRunner.release();
    }
  }

  public async startExperimentPreview(dto: StartExperimentPreviewDto, experimentId: string): Promise<CustomResponseType> {
    const experimentEntity = await this.getExperimentById(experimentId, 1);
    return {
      statusCode: HttpStatus.OK,
      data: {
        experiment: await this.getExperimentById(experimentEntity.id, 2),
        variables: await this.prepareVariablesForStart(experimentEntity, dto),
      },
    };
  }

  public async delete(id: string): Promise<CustomResponseType> {
    await this.variableModel.deleteMany({ experimentId: id }).exec();
    await this.experimentsRepository.delete({ id });

    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async updateExperimentStatus(dto: UpdateExperimentStatusDto, experimentId: string): Promise<CustomResponseType> {
    const experimentEntity = await this.getExperimentById(experimentId, 1);
    if (!experimentEntity) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    } else if (dto.status === experimentEntity.status) {
      throw new CustomException({
        statusCode: HttpStatus.CONFLICT,
        errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_ALREADY_HAS_THIS_STATUS,
      });
    }
    checkIsUpdated(await this.experimentsRepository.update({ id: experimentEntity.id }, dto));
    experimentEntity.status = dto.status;
    return {
      statusCode: HttpStatus.OK,
      data: { experiment: experimentEntity },
    };
  }

  private async getExperimentById(id: string, dataSize = 0): Promise<ExperimentEntity> {
    if (dataSize === 0) {
      // default
      return await this.experimentsRepository.findOne({
        where: {
          id,
        },
        select: {
          id: true,
          title: true,
          description: true,
          usersEnded: true,
          usersStarted: true,
          averagePassageTime: true,
          saveSettings: {
            timeOnEachSlide: true,
            totalTime: true,
            startTime: true,
            endTime: true,
          },
          requestedBasicRespondentData: {
            firstName: true,
            lastName: true,
            birthday: true,
            sex: true,
            email: true,
            phone: true,
            nativeLanguages: true,
            learnedLanguages: true,
          },
          accessConditions: true,
          requestedParametersRespondentData: true,
          requestedQuestions: true,
          transitionShortcutSettings: {
            keyboard: true,
            mouse: true,
            keyShortcut: true,
          },
          creators: true,
          status: true,
          platform: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }
    if (dataSize === 1) {
      // minimal with owner
      return await this.experimentsRepository.findOne({
        where: {
          id,
        },
        relations: {
          user: true,
        },
        select: {
          id: true,
          title: true,
          status: true,
          usersStarted: true,
          platform: true,
          saveSettings: {
            timeOnEachSlide: true,
            totalTime: true,
            startTime: true,
            endTime: true,
          },
          requestedBasicRespondentData: {
            firstName: true,
            lastName: true,
            birthday: true,
            sex: true,
            email: true,
            phone: true,
            nativeLanguages: true,
            learnedLanguages: true,
          },
          accessConditions: true,
          requestedParametersRespondentData: true,
          requestedQuestions: true,
          user: {
            id: true,
          },
        },
      });
    }
    if (dataSize === 2) {
      // for start
      return await this.experimentsRepository.findOne({
        where: {
          id,
        },
        relations: {
          slides: {
            children: {
              rows: true,
            },
            rows: true,
          },
        },
        order: {
          slides: {
            position: 'ASC',
            rows: {
              position: 'ASC',
            },
            children: {
              position: 'ASC',
              rows: {
                position: 'ASC',
              },
            },
          },
        },
        select: {
          id: true,
          transitionShortcutSettings: {
            keyboard: true,
            mouse: true,
            keyShortcut: true,
          },
          slides: {
            ...slideEntityBaseSelectOptions,
            children: {
              ...cycleChildEntityBaseSelectOptions,
              rows: {
                id: true,
                height: true,
                maxColumn: true,
                position: true,
                elements: true,
              },
            },
            rows: {
              id: true,
              height: true,
              maxColumn: true,
              position: true,
              elements: true,
            },
          },
          usersStarted: true,
        },
      });
    }
    if (dataSize === 3) {
      // default with slides (no rows, only for first slide)
      const preparedExperimentEntity = await this.experimentsRepository.findOne({
        where: {
          id,
        },
        relations: {
          slides: {
            children: true,
          },
          user: true,
        },
        order: {
          slides: {
            position: 'ASC',
            children: {
              position: 'ASC',
            },
          },
        },
        select: {
          id: true,
          title: true,
          description: true,
          saveSettings: {
            timeOnEachSlide: true,
            totalTime: true,
            startTime: true,
            endTime: true,
          },
          requestedBasicRespondentData: {
            firstName: true,
            lastName: true,
            birthday: true,
            sex: true,
            email: true,
            phone: true,
            nativeLanguages: true,
            learnedLanguages: true,
          },
          transitionShortcutSettings: {
            keyboard: true,
            mouse: true,
            keyShortcut: true,
          },
          accessConditions: true,
          requestedParametersRespondentData: true,
          requestedQuestions: true,
          creators: true,
          status: true,
          user: {
            firstName: true,
            lastName: true,
            middleName: true,
            avatarUrl: true,
          },
          usersStarted: true,
          usersEnded: true,
          averagePassageTime: true,
          platform: true,
          createdAt: true,
          updatedAt: true,
          slides: {
            ...slideEntityBaseSelectOptions,
            children: {
              ...cycleChildEntityBaseSelectOptions,
            },
          },
        },
      });
      const firstSlide = await this.slidesRepository.findOne({
        where: { position: 1, experiment: { id: id } },
        relations: {
          children: {
            rows: true,
          },
          rows: true,
        },
        order: {
          position: 'ASC',
          children: {
            position: 'ASC',
          },
        },
        select: {
          ...slideEntityBaseSelectOptions,
          rows: {
            id: true,
            height: true,
            maxColumn: true,
            position: true,
            elements: true,
          },
          children: {
            ...cycleChildEntityBaseSelectOptions,
            rows: {
              id: true,
              height: true,
              maxColumn: true,
              position: true,
              elements: true,
            },
          },
        },
      });
      if (!firstSlide) {
        throw new CustomException({
          statusCode: HttpStatus.BAD_REQUEST,
          errorTypeCode: CustomErrorTypeEnum.SLIDE_ID_NOT_FOUND,
        });
      }
      if (!preparedExperimentEntity?.slides.length) {
        preparedExperimentEntity.slides = [];
      }
      preparedExperimentEntity.slides.shift();
      preparedExperimentEntity.slides.unshift(firstSlide);
      return preparedExperimentEntity;
    }
    if (dataSize === 4) {
      // like 3 but without slides
      return await this.experimentsRepository.findOne({
        where: {
          id,
        },
        relations: {
          user: true,
        },
        select: {
          id: true,
          title: true,
          description: true,
          saveSettings: {
            timeOnEachSlide: true,
            totalTime: true,
            startTime: true,
            endTime: true,
          },
          requestedBasicRespondentData: {
            firstName: true,
            lastName: true,
            birthday: true,
            sex: true,
            email: true,
            phone: true,
            nativeLanguages: true,
            learnedLanguages: true,
          },
          transitionShortcutSettings: {
            keyboard: true,
            mouse: true,
            keyShortcut: true,
          },
          accessConditions: true,
          requestedParametersRespondentData: true,
          requestedQuestions: true,
          creators: true,
          status: true,
          user: {
            firstName: true,
            lastName: true,
            middleName: true,
            avatarUrl: true,
          },
          usersStarted: true,
          usersEnded: true,
          averagePassageTime: true,
          platform: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }
  }

  private validateStartExperimentData(dto: StartExperimentDto, experimentEntity: ExperimentEntity, isPreview?: boolean): void {
    if (experimentEntity.platform !== dto.platform) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.ACCESS_DENIED_FOR_THIS_PLATFORM,
      });
    }
    if (!isPreview && experimentEntity.status === ExperimentStatusEnum.UNPUBLISHED) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_CAN_NOT_START_UNPUBLISHED,
      });
    }
    if (experimentEntity.requestedBasicRespondentData.firstName) {
      if (!dto.firstName) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          validationError: [{ property: 'firstName', validationErrorTypeCode: ValidationErrorTypeEnum.IS_DEFINED }],
        });
      }
    } else if (dto.firstName) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validationError: [{ property: 'firstName', validationErrorTypeCode: ValidationErrorTypeEnum.WHITE_LIST_VALIDATION }],
      });
    }

    if (experimentEntity.requestedBasicRespondentData.lastName) {
      if (!dto.lastName) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          validationError: [{ property: 'lastName', validationErrorTypeCode: ValidationErrorTypeEnum.IS_DEFINED }],
        });
      }
    } else if (dto.lastName) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validationError: [{ property: 'lastName', validationErrorTypeCode: ValidationErrorTypeEnum.WHITE_LIST_VALIDATION }],
      });
    }

    if (experimentEntity.requestedBasicRespondentData.birthday) {
      if (!dto.birthday) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          validationError: [{ property: 'birthday', validationErrorTypeCode: ValidationErrorTypeEnum.IS_DEFINED }],
        });
      }
    } else if (dto.birthday) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validationError: [{ property: 'birthday', validationErrorTypeCode: ValidationErrorTypeEnum.WHITE_LIST_VALIDATION }],
      });
    }

    if (experimentEntity.requestedBasicRespondentData.sex) {
      if (dto.sex === null) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          validationError: [{ property: 'sex', validationErrorTypeCode: ValidationErrorTypeEnum.IS_DEFINED }],
        });
      }
    } else if (dto.sex !== null) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validationError: [{ property: 'sex', validationErrorTypeCode: ValidationErrorTypeEnum.WHITE_LIST_VALIDATION }],
      });
    }

    if (experimentEntity.requestedBasicRespondentData.email) {
      if (!dto.email) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          validationError: [{ property: 'email', validationErrorTypeCode: ValidationErrorTypeEnum.IS_DEFINED }],
        });
      }
    } else if (dto.email) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validationError: [{ property: 'email', validationErrorTypeCode: ValidationErrorTypeEnum.WHITE_LIST_VALIDATION }],
      });
    }

    if (experimentEntity.requestedBasicRespondentData.phone) {
      if (!dto.phone) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          validationError: [{ property: 'phone', validationErrorTypeCode: ValidationErrorTypeEnum.IS_DEFINED }],
        });
      }
    } else if (dto.phone) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validationError: [{ property: 'phone', validationErrorTypeCode: ValidationErrorTypeEnum.WHITE_LIST_VALIDATION }],
      });
    }

    if (experimentEntity.requestedBasicRespondentData.nativeLanguages) {
      if (!dto.nativeLanguages || !dto.nativeLanguages.length) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          validationError: [{ property: 'nativeLanguages', validationErrorTypeCode: ValidationErrorTypeEnum.IS_DEFINED }],
        });
      }
    } else if (dto.nativeLanguages) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validationError: [{ property: 'nativeLanguages', validationErrorTypeCode: ValidationErrorTypeEnum.WHITE_LIST_VALIDATION }],
      });
    }

    if (experimentEntity.requestedBasicRespondentData.learnedLanguages) {
      if (!dto.learnedLanguages || !dto.learnedLanguages.length) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          validationError: [{ property: 'learnedLanguages', validationErrorTypeCode: ValidationErrorTypeEnum.IS_DEFINED }],
        });
      }
    } else if (dto.learnedLanguages) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validationError: [{ property: 'learnedLanguages', validationErrorTypeCode: ValidationErrorTypeEnum.WHITE_LIST_VALIDATION }],
      });
    }

    if (experimentEntity.requestedParametersRespondentData.length) {
      if (!dto.requestedParametersRespondentData) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          validationError: [{ property: 'requestedParametersRespondentData', validationErrorTypeCode: ValidationErrorTypeEnum.IS_DEFINED }],
        });
      }
    } else if (dto.requestedParametersRespondentData) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validationError: [{ property: 'requestedParametersRespondentData', validationErrorTypeCode: ValidationErrorTypeEnum.WHITE_LIST_VALIDATION }],
      });
    }

    if (experimentEntity.requestedQuestions.length) {
      if (!dto.requestedQuestions) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          validationError: [{ property: 'requestedQuestions', validationErrorTypeCode: ValidationErrorTypeEnum.IS_DEFINED }],
        });
      }
      const requiredQuestionArray = experimentEntity.requestedQuestions.map((el) => {
        if (el.isRequired) {
          return el;
        }
      });
      if (lod.differenceBy(requiredQuestionArray, dto.requestedQuestions, 'id').length) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_INCORRECT_USER_DATA,
        });
      }
    } else if (dto.requestedQuestions) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validationError: [{ property: 'requestedQuestions', validationErrorTypeCode: ValidationErrorTypeEnum.WHITE_LIST_VALIDATION }],
      });
    }

    const requestedParametersRespondentDataLength = experimentEntity.requestedParametersRespondentData.length;
    if (requestedParametersRespondentDataLength) {
      if (requestedParametersRespondentDataLength !== dto.requestedParametersRespondentData.length) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_INCORRECT_USER_DATA,
        });
      }
      if (lod.differenceBy(dto.requestedParametersRespondentData, experimentEntity.requestedParametersRespondentData, 'id').length) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_INCORRECT_USER_DATA,
        });
      }
    }
  }

  private async prepareVariablesForStart(experimentEntity: ExperimentEntity, dto: StartExperimentDto): Promise<object[]> {
    const preparedVariablesArray: object[] = [];
    const variablesNotIncludedInSettings = await this.variableModel
      .find(
        {
          _id: { $nin: lod.map(experimentEntity.requestedParametersRespondentData, 'variableId') },
          experimentId: experimentEntity.id,
        },
        { _id: true, 'value.content': true },
      )
      .exec();
    if (experimentEntity?.requestedParametersRespondentData?.length) {
      if (!dto?.requestedParametersRespondentData?.length) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          validationError: [{ property: 'requestedParametersRespondentData', validationErrorTypeCode: ValidationErrorTypeEnum.IS_DEFINED }],
        });
      }
      if (
        !lod.isEqual(
          lod.sortBy(lod.map(experimentEntity.requestedParametersRespondentData, 'id')),
          lod.sortBy(lod.map(dto?.requestedParametersRespondentData, 'id')),
        )
      ) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        });
      }
      for (const el of dto.requestedParametersRespondentData) {
        const settingsData = lod.find(experimentEntity.requestedParametersRespondentData, { id: el.id });
        const variableEntity = await this.variableModel
          .findOne(
            {
              _id: settingsData.variableId,
            },
            { _id: true, 'value.content': true, columns: { $elemMatch: { _id: settingsData.attributeId } } },
          )
          .exec();
        if (!variableEntity) {
          throw new CustomException({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          });
        }
        if (variableEntity.columns.length > 1) {
          throw new CustomException({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          });
        }
        const valueIndexes: string[] = this.getAllIndexes(variableEntity.columns[0].content, el.value);
        const temp = [];
        for (const element of valueIndexes) {
          temp.push(variableEntity.value.content[`${element}`]);
        }
        variableEntity.value.content = temp;
        variableEntity.columns = undefined;
        preparedVariablesArray.push(variableEntity);
      }
    }
    return preparedVariablesArray.concat(variablesNotIncludedInSettings);
  }

  private checkExperimentAccess(experimentAccessConditions: ExperimentEntity['accessConditions'], user: StartExperimentDto): void {
    for (const el of experimentAccessConditions)
      switch (el.condition) {
        case accessConditionsConditionEnum.AGE:
          if (user?.birthday === null) {
            throw new CustomException({
              statusCode: HttpStatus.FORBIDDEN,
              errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_INCORRECT_USER_DATA,
            });
          }
          const age = dayjs().diff(user.birthday, 'y');
          const requiredAge = Number(el.value);
          switch (el.operator) {
            case accessConditionsOperatorEnum.EQUALS:
              if (age !== requiredAge) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_AGE_EQUALS,
                });
              }
              break;
            case accessConditionsOperatorEnum.NOT_EQUALS:
              if (age === requiredAge) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_AGE_NOT_EQUALS,
                });
              }
              break;
            case accessConditionsOperatorEnum.MORE:
              if (!(age > requiredAge)) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_AGE_MORE,
                });
              }
              break;
            case accessConditionsOperatorEnum.LESS:
              if (!(age < requiredAge)) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_AGE_LESS,
                });
              }
              break;
            case accessConditionsOperatorEnum.MORE_OR_EQUALS:
              if (!(age >= requiredAge)) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_AGE_MORE_OR_EQUALS,
                });
              }
              break;
            case accessConditionsOperatorEnum.LESS_OR_EQUALS:
              if (!(age <= requiredAge)) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_AGE_LESS_OR_EQUALS,
                });
              }
          }
          break;
        case accessConditionsConditionEnum.SEX:
          if (user?.sex === null) {
            throw new CustomException({
              statusCode: HttpStatus.FORBIDDEN,
              errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_INCORRECT_USER_DATA,
            });
          }
          const requiredSex: UserSexEnum = Number(el.value);
          switch (el.operator) {
            case accessConditionsOperatorEnum.EQUALS:
              if (user.sex !== requiredSex) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_SEX_EQUALS,
                });
              }
              break;
            case accessConditionsOperatorEnum.NOT_EQUALS:
              if (user.sex === requiredSex) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_SEX_NOT_EQUALS,
                });
              }
          }
          break;
        case accessConditionsConditionEnum.NATIVE_LANGUAGE:
          if (user?.nativeLanguages === null) {
            throw new CustomException({
              statusCode: HttpStatus.FORBIDDEN,
              errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_INCORRECT_USER_DATA,
            });
          }
          switch (el.operator) {
            case accessConditionsOperatorEnum.EQUALS:
              if (user.nativeLanguages.indexOf(el.value) == -1) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_NATIVE_LANGUAGES_NOT_EQUALS,
                });
              }
              break;
            case accessConditionsOperatorEnum.NOT_EQUALS:
              if (user.nativeLanguages.indexOf(el.value) !== -1) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_NATIVE_LANGUAGES_EQUALS,
                });
              }
          }
          break;
        case accessConditionsConditionEnum.LEARNED_LANGUAGE:
          if (user?.learnedLanguages === null) {
            throw new CustomException({
              statusCode: HttpStatus.FORBIDDEN,
              errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_INCORRECT_USER_DATA,
            });
          }
          switch (el.operator) {
            case accessConditionsOperatorEnum.EQUALS:
              if (user.learnedLanguages.indexOf(el.value) == -1) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_LEARNED_LANGUAGES_NOT_EQUALS,
                });
              }
              break;
            case accessConditionsOperatorEnum.NOT_EQUALS:
              if (user.learnedLanguages.indexOf(el.value) !== -1) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_LEARNED_LANGUAGES_EQUALS,
                });
              }
          }
      }
  }

  private getAllIndexes(arr, val) {
    const indexes = [];
    for (let i = 0; i < arr.length; i++) if (arr[i] === val) indexes.push(i);
    return indexes;
  }
}
