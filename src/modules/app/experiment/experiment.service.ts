import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import * as lod from 'lodash';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { CustomResponseType } from 'src/common/types/customResponseType';
import { CustomErrorTypeEnum, ValidationErrorTypeEnum } from '../../../common/enums/errorType.enum';
import { CustomException } from '../../../common/exceptions/custom.exception';
import { MongoTransactionRunner } from '../../../common/functions/mongoTransactionRunner.function';
import { Statistic, StatisticDocument } from '../../appStatistic/database/entities/statistic.entity';
import {
  accessConditionsConditionEnum,
  accessConditionsOperatorEnum,
  AccessConditionsPropertyDocument,
  ExperimentDocument,
  ExperimentSortOptionEnum,
  ExperimentStatusEnum,
  RequestedParametersRespondentDataPropertyDocument,
} from '../database/entities/experiment.entity';
import { LanguageDocument } from '../database/entities/language.entity';
import { SlideDocument } from '../database/entities/slide.entity';
import { UserSexEnum } from '../database/entities/user.entity';
import { VariableDocument } from '../database/entities/variable.schema';
import { CreateExperimentDto } from './dto/createExperiment.dto';
import { ReadExperimentsDto } from './dto/readExperiments.dto';
import { StartExperimentDto } from './dto/startExperiment.dto';
import { StartExperimentPreviewDto } from './dto/startExperimentPreview.dto';
import { UpdateExperimentDto } from './dto/updateExperiment.dto';
import { UpdateExperimentStatusDto } from './dto/updateExperimentStatus.dto';
import { checkIsUpdated } from '../../../common/functions/checkIsUpdated.function';
import { entityNameConstant } from '../../../common/constants/entityName.constant';

@Injectable()
export class ExperimentService {
  constructor(
    @InjectModel(entityNameConstant.EXPERIMENT) private readonly experimentModel: Model<ExperimentDocument>,
    @InjectModel(entityNameConstant.SLIDE) private readonly slideModel: Model<SlideDocument>,
    @InjectModel(entityNameConstant.VARIABLE) private readonly variableModel: Model<VariableDocument>,
    @InjectModel(entityNameConstant.LANGUAGE) private readonly languageModel: Model<LanguageDocument>,
    @InjectModel(Statistic.name, 'statistic') private readonly statisticModel: Model<StatisticDocument>,
    @InjectConnection() private readonly mongoConnection: mongoose.Connection,
    @InjectConnection('statistic') private readonly mongoConnectionStatistic: mongoose.Connection,
  ) {}

  public async create(dto: CreateExperimentDto, userId: string): Promise<CustomResponseType> {
    await this.isUniqueValueForUser(dto.title, 'title', userId);

    const newRecord: ExperimentDocument = await MongoTransactionRunner(this.mongoConnection, async (session) => {
      const experimentEntity: ExperimentDocument = await new this.experimentModel({ ...dto, user: new mongoose.Types.ObjectId(userId) }).save({ session });
      await new this.slideModel({ title: 'Slide 1', position: 1, experiment: experimentEntity._id }).save({ session });
      return experimentEntity;
    });

    const experimentEntity = await this.getExperimentById(newRecord.id, 3);

    return {
      statusCode: HttpStatus.CREATED,
      data: experimentEntity,
    };
  }

  public async update(dto: UpdateExperimentDto, experimentId: string, userId: string): Promise<CustomResponseType> {
    await this.isUniqueValueForUser(dto.title, 'title', userId, true);

    const requestedParametersRespondentDataCount = dto?.requestedParametersRespondentData?.length;
    if (requestedParametersRespondentDataCount > 0) {
      for (const item of dto.requestedParametersRespondentData) {
        const variableModelCount = await this.variableModel.count({ _id: item.variableId, 'columns._id': item.attributeId }).exec();
        if (variableModelCount !== requestedParametersRespondentDataCount) {
          throw new CustomException({
            statusCode: HttpStatus.NOT_FOUND,
            errorTypeCode: CustomErrorTypeEnum.VARIABLE_NOT_FOUND,
          });
        }
      }
    }

    checkIsUpdated(await this.experimentModel.updateOne({ _id: experimentId }, dto));

    return {
      statusCode: HttpStatus.OK,
      data: { experiment: await this.getExperimentById(experimentId) },
    };
  }

  public async readExperiments(page: number, dtoQuery: ReadExperimentsDto, userId?: string): Promise<CustomResponseType> {
    const whereOption = ((): FilterQuery<ExperimentDocument> => {
      const resultObject: FilterQuery<ExperimentDocument> = {};
      if (dtoQuery.query) {
        resultObject.title = { $regex: '.*' + dtoQuery.query + '.*', $options: 'i' };
      }
      if (userId && dtoQuery.experimentStatus) {
        resultObject['user._id'] = new mongoose.Types.ObjectId(userId);
        resultObject.status = dtoQuery.experimentStatus;
      } else if (userId) {
        resultObject['user._id'] = new mongoose.Types.ObjectId(userId);
      } else {
        resultObject.status = ExperimentStatusEnum.PUBLISHED;
      }
      return resultObject;
    })();

    const sortOption = ((): Record<string, 1 | -1> => {
      if (dtoQuery.sortBy === ExperimentSortOptionEnum.ALPHABETICAL) {
        if (dtoQuery.order === 'DESC') {
          return { title: -1 };
        } else {
          return { title: 1 };
        }
      } else {
        if (dtoQuery.order === 'DESC') {
          return { createdAt: -1 };
        } else {
          return { createdAt: 1 };
        }
      }
    })();

    const experimentEntityArray = await this.experimentModel
      .aggregate([
        {
          $lookup: {
            from: 'user',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $match: whereOption,
        },
        {
          $facet: {
            experiments: [{ $skip: (page - 1) * 10 }, { $limit: 10 }, { $sort: sortOption }],
            totalCount: [
              {
                $count: 'total',
              },
            ],
          },
        },
        { $unwind: '$totalCount' },
        { $set: { totalCount: '$totalCount.total' } },
      ])
      .exec();

    return {
      statusCode: HttpStatus.OK,
      data: experimentEntityArray,
    };
  }

  public async readExperimentById(experimentId: string, defaultFormat?: boolean): Promise<CustomResponseType> {
    let experimentEntity: ExperimentDocument;

    if (defaultFormat) {
      experimentEntity = await this.getExperimentById(experimentId);
    } else {
      experimentEntity = await this.getExperimentById(experimentId, 3);
    }
    if (!experimentEntity) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    // for (const [index, param] of experimentEntity.requestedParametersRespondentData.entries()) {
    //   const variableId = param.variableId;
    //   const variable = await this.variableModel.findOne({ _id: variableId });
    //
    //   if (variable) {
    //     experimentEntity.requestedParametersRespondentData[index] = { ...param, columns: variable.columns } as RequestedParametersRespondentDataType;
    //   }
    // }

    return {
      statusCode: HttpStatus.OK,
      data: {
        experiment: experimentEntity,
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
      const mongoTransactionSession = await this.mongoConnectionStatistic.startSession();

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

        const lastSlide = lod.find(sessionEntity.statistics, {
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

    try {
      const experimentEntityForStart = await this.getExperimentById(experimentEntity.id, 2);
      let slidePosCounter = 1;

      let nativeLanguages: LanguageDocument[];
      let learnedLanguages: LanguageDocument[];
      let requestedParametersRespondentData: string[];
      let requestedQuestions: string[];

      if (dto?.nativeLanguages) {
        nativeLanguages = await this.languageModel.find({ id: { $in: dto.learnedLanguages } }, { id: true, title: true, region: true });
      }
      if (dto?.learnedLanguages) {
        learnedLanguages = await this.languageModel.find({ id: { $in: dto.learnedLanguages } }, { id: true, title: true, region: true });
      }
      if (dto?.requestedParametersRespondentData) {
        requestedParametersRespondentData = dto.requestedParametersRespondentData.map(
          (el: any) => `${lod.find(experimentEntity.requestedParametersRespondentData, { id: el._id }).title}: ${el.value}`,
        );
      }
      if (dto?.requestedQuestions) {
        requestedQuestions = dto.requestedQuestions.map((el) => `${lod.find(experimentEntity.requestedQuestions, { id: el.id }).question}: ${el.answers}`);
      }

      const sessionEntity = await new this.statisticModel({
        experimentId: experimentEntity.id,
        ownerId: experimentEntity.user.id,
        experimentTitle: experimentEntity.title,
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
          for (const elem of el?.descendants) {
            res.push({ slideId: elem.id, slideTitle: elem.title, isTraining: elem.training, constructorPosition: slidePosCounter++, isChild: true });
          }
          return res;
        }),
      }).save();

      const variableEntityArray = await this.prepareVariablesForStart(experimentEntity, dto);

      await this.experimentModel.updateOne({ _id: experimentId }, { usersStarted: experimentEntity.usersStarted + 1 });

      return {
        statusCode: HttpStatus.OK,
        data: {
          experiment: experimentEntityForStart,
          variables: variableEntityArray,
          sessionId: sessionEntity._id,
        },
      };
    } catch (e) {
      console.error(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
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
    await this.experimentModel.deleteOne({ id }).exec();

    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async updateExperimentStatus(dto: UpdateExperimentStatusDto, experimentId: string): Promise<CustomResponseType> {
    const experimentEntity: ExperimentDocument = await this.getExperimentById(experimentId, 1);
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

    checkIsUpdated(await this.experimentModel.updateOne({ _id: experimentEntity.id }, dto).exec());

    return {
      statusCode: HttpStatus.OK,
    };
  }

  private async getExperimentById(id: string, dataSize = 0): Promise<ExperimentDocument> {
    if (dataSize === 0) {
      // default
      return await this.experimentModel
        .findById(id, {
          id: true,
          title: true,
          description: true,
          saveSettings: true,
          requestedBasicRespondentData: true,
          accessConditions: true,
          requestedParametersRespondentData: true,
          requestedQuestions: true,
          transitionShortcutSettings: true,
          creators: true,
          status: true,
          platform: true,
          createdAt: true,
          updatedAt: true,
        })
        .exec();
    }
    if (dataSize === 1) {
      // minimal with owner
      return await this.experimentModel
        .findById(id, {
          select: {
            id: true,
            title: true,
            status: true,
            usersStarted: true,
            platform: true,
            saveSettings: true,
            requestedBasicRespondentData: true,
            accessConditions: true,
            requestedParametersRespondentData: true,
            requestedQuestions: true,
          },
        })
        .populate('user', { id: true })
        .exec();
    }
    if (dataSize === 2) {
      // for start
      return await this.experimentModel
        .findById(id, {
          id: true,
          transitionShortcutSettings: true,
          usersStarted: true,
        })
        .populate({
          path: 'slides',
          options: { sort: { position: 'ASC' } },
          populate: { path: 'childs', options: { sort: { position: 'ASC' } } },
        })
        .exec();
    }
    if (dataSize === 3) {
      // default with slides (no rows, only for first slide)
      const preparedExperimentEntity = await this.experimentModel
        .findById(id, {
          _id: true,
          title: true,
          description: true,
          saveSettings: true,
          requestedBasicRespondentData: true,
          transitionShortcutSettings: true,
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
        })
        .populate({ path: 'user', select: { firstName: true, lastName: true, middleName: true, avatarUrl: true } })
        .populate({
          path: 'slides',
          select: { rows: false },
          options: { sort: { position: 'ASC' } },
          populate: { path: 'childs', select: { rows: false }, options: { sort: { position: 'ASC' } } },
        })
        .exec();

      const firstSlideEntity = await this.slideModel.findOne({ position: 1, experiment: id }).populate({ path: 'childs' }).exec();
      if (!firstSlideEntity) {
        throw new CustomException({
          statusCode: HttpStatus.BAD_REQUEST,
          errorTypeCode: CustomErrorTypeEnum.SLIDE_ID_NOT_FOUND,
        });
      }
      if (!preparedExperimentEntity?.slides.length) {
        preparedExperimentEntity.slides = [];
      }
      preparedExperimentEntity.slides.shift();
      preparedExperimentEntity.slides.unshift(firstSlideEntity);
      return preparedExperimentEntity;
    }
  }

  private validateStartExperimentData(dto: StartExperimentDto, experimentEntity: ExperimentDocument, isPreview?: boolean): void {
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

  private async prepareVariablesForStart(experimentEntity: ExperimentDocument, dto: StartExperimentDto): Promise<object[]> {
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
      // Is it works?
      for (const el of dto.requestedParametersRespondentData) {
        const settingsData: RequestedParametersRespondentDataPropertyDocument = lod.find(experimentEntity.requestedParametersRespondentData, {
          _id: el['_id'],
        }) as RequestedParametersRespondentDataPropertyDocument;
        const variableEntity = await this.variableModel
          .findOne(
            {
              _id: settingsData.variable,
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

        const indexes: number[] = [];
        for (let i = 0; i < variableEntity.columns[0].content.length; i++) if (variableEntity.columns[0].content[i] === el.value) indexes.push(i);
        const temp = [];
        for (const element of indexes) {
          temp.push(variableEntity.value.content[`${element}`]);
        }
        variableEntity.value.content = temp;
        variableEntity.columns = undefined;
        preparedVariablesArray.push(variableEntity);
      }
    }
    return preparedVariablesArray.concat(variablesNotIncludedInSettings);
  }

  private checkExperimentAccess(experimentAccessConditions: AccessConditionsPropertyDocument[], dto: StartExperimentDto): void {
    for (const el of experimentAccessConditions)
      switch (el.condition) {
        case accessConditionsConditionEnum.AGE:
          if (dto?.birthday === null) {
            throw new CustomException({
              statusCode: HttpStatus.FORBIDDEN,
              errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_INCORRECT_USER_DATA,
            });
          }
          const age = dayjs().diff(dto.birthday, 'y');
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
          if (dto?.sex === null) {
            throw new CustomException({
              statusCode: HttpStatus.FORBIDDEN,
              errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_INCORRECT_USER_DATA,
            });
          }
          const requiredSex: UserSexEnum = Number(el.value);
          switch (el.operator) {
            case accessConditionsOperatorEnum.EQUALS:
              if (dto.sex !== requiredSex) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_SEX_EQUALS,
                });
              }
              break;
            case accessConditionsOperatorEnum.NOT_EQUALS:
              if (dto.sex === requiredSex) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_SEX_NOT_EQUALS,
                });
              }
          }
          break;
        case accessConditionsConditionEnum.NATIVE_LANGUAGE:
          if (dto?.nativeLanguages === null) {
            throw new CustomException({
              statusCode: HttpStatus.FORBIDDEN,
              errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_INCORRECT_USER_DATA,
            });
          }
          switch (el.operator) {
            case accessConditionsOperatorEnum.EQUALS:
              if (dto.nativeLanguages.indexOf(el.value) >= 0) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_NATIVE_LANGUAGES_EQUALS,
                });
              }
              break;
            case accessConditionsOperatorEnum.NOT_EQUALS:
              if (dto.nativeLanguages.indexOf(el.value) !== -1) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_NATIVE_LANGUAGES_NOT_EQUALS,
                });
              }
          }
          break;
        case accessConditionsConditionEnum.LEARNED_LANGUAGE:
          if (dto?.learnedLanguages === null) {
            throw new CustomException({
              statusCode: HttpStatus.FORBIDDEN,
              errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_INCORRECT_USER_DATA,
            });
          }
          switch (el.operator) {
            case accessConditionsOperatorEnum.EQUALS:
              if (dto.learnedLanguages.indexOf(el.value) >= 0) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_LEARNED_LANGUAGES_EQUALS,
                });
              }
              break;
            case accessConditionsOperatorEnum.NOT_EQUALS:
              if (dto.learnedLanguages.indexOf(el.value) !== -1) {
                throw new CustomException({
                  statusCode: HttpStatus.FORBIDDEN,
                  errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_START_LEARNED_LANGUAGES_NOT_EQUALS,
                });
              }
          }
      }
  }

  private async isUniqueValueForUser(value: string, property: string, userId: string, isUpdate?: boolean): Promise<void> {
    const found: number = await this.experimentModel.count({ [property]: value, user: userId }).exec();
    if (isUpdate) {
      if (found > 1) {
        throw new CustomException({
          statusCode: HttpStatus.CONFLICT,
          validationError: [{ property: property, validationErrorTypeCode: ValidationErrorTypeEnum.IS_UNIQUE }],
        });
      }
    } else {
      if (found >= 1) {
        throw new CustomException({
          statusCode: HttpStatus.CONFLICT,
          validationError: [{ property: property, validationErrorTypeCode: ValidationErrorTypeEnum.IS_UNIQUE }],
        });
      }
    }
  }

  private getAllIndexes(arr, val) {
    const indexes = [];
    for (let i = 0; i < arr.length; i++) if (arr[i] === val) indexes.push(i);
    return indexes;
  }
}
