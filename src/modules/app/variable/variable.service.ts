import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import * as lod from 'lodash';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { PostgresDataSource } from 'src/common/configs/typeorm.config';
import { ExperimentAccessByEnum } from 'src/common/enums/experimentAccessBy.enum';
import { ExperimentAccessStatusEnum } from 'src/common/enums/experimentAccessStatus.enum';
import { CheckExperimentAccess } from 'src/common/validators/checkExperimentAccess';
import { isEmptyObject } from 'src/common/validators/isEmptyObject.validator';
import { Repository } from 'typeorm';
import { CustomErrorTypeEnum, ValidationErrorTypeEnum } from '../../../common/enums/errorType.enum';
import { CustomException } from '../../../common/exceptions/custom.exception';
import { CustomResponseType } from '../../../common/types/customResponseType';
import { ExperimentEntity, ExperimentStatusEnum } from '../database/entities/postgres/experiment.entity';
import { AddColumnsDto } from './dto/addColumnsDto';
import { AddRowsDto } from './dto/addRowsDto';
import { CreateVariableDto } from './dto/createVariable.dto';
import { DeleteVariableDto } from './dto/deleteVariable.dto';
import { RemoveColumnsDto } from './dto/removeColumns.dto';
import { RemoveRowsDto } from './dto/removeRows.dto';
import { UpdateVariableDto } from './dto/updateVariable.dto';
import { Variable, VariableDocument } from '../database/entities/variable.schema';

@Injectable()
export class VariableService {
  constructor(
    @InjectModel(Variable.name) private readonly variableModel: Model<VariableDocument>,
    @InjectRepository(ExperimentEntity) private readonly experimentsRepository: Repository<ExperimentEntity>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  public async create(dto: CreateVariableDto, experimentId: string): Promise<CustomResponseType> {
    const isUniqueName = await this.checkIsUnique(
      'name',
      dto.variables.map(({ name }) => name),
      experimentId,
    );
    if (!isUniqueName) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validationError: [{ property: 'name', validationErrorTypeCode: ValidationErrorTypeEnum.IS_UNIQUE }],
      });
    }
    const mongoTransactionSession = await this.connection.startSession();
    const answerData: object[] = [];
    mongoTransactionSession.startTransaction();
    try {
      for (const el of dto.variables) {
        const elModel = await new this.variableModel({ experimentId: experimentId, ...el }).save({ session: mongoTransactionSession });
        answerData.push({ _id: elModel._id, name: elModel.name });
      }
      await mongoTransactionSession.commitTransaction();
    } catch (e) {
      await mongoTransactionSession.abortTransaction();
      console.log(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } finally {
      await mongoTransactionSession.endSession();
    }

    return {
      statusCode: HttpStatus.CREATED,
      data: {
        variables: answerData,
      },
    };
  }

  public async update(dto: UpdateVariableDto, userId: string, variableId: string): Promise<CustomResponseType> {
    isEmptyObject(dto);

    const variableModel = await this.variableModel.findById(variableId, { name: true, value: true, experimentId: true }).exec();
    if (!variableModel) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const checkExperimentAccess = await CheckExperimentAccess(variableModel.experimentId, userId, ExperimentAccessByEnum.EXPERIMENT, true);
    if (checkExperimentAccess === ExperimentAccessStatusEnum.NO_USER_ACCESS) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    } else if (checkExperimentAccess === ExperimentAccessStatusEnum.NO_STATUS_ACCESS) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_CAN_NOT_UPDATE_PUBLISHED,
      });
    }

    const variableDataForUpdateObj: object = {};
    const variableArraysLength = variableModel.value.content.length;

    if (dto?.name && variableModel.name !== dto?.name) {
      const isUniqueName = await this.checkIsUnique('name', [dto.name], variableModel.experimentId, variableId);
      if (!isUniqueName) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          validationError: [{ property: 'name', validationErrorTypeCode: ValidationErrorTypeEnum.IS_UNIQUE }],
        });
      }
      variableDataForUpdateObj['name'] = dto.name;
    }

    if (dto?.value) {
      if (dto.value?.content && dto.value?.content?.length !== variableArraysLength) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          errorTypeCode: CustomErrorTypeEnum.VARIABLE_ARRAY_LENGTH_NOT_CORRECT,
        });
      }
      if (dto.value?.title) variableDataForUpdateObj['value.title'] = dto.value.title;
      if (dto.value?.content) variableDataForUpdateObj['value.content'] = dto.value.content;
    }

    const columnTitles = dto?.columns?.map(({ title }) => title);
    if (dto?.columns && columnTitles?.length) {
      const isUniqueColumnsTitle = await this.checkIsUnique('columns.title', columnTitles, variableModel.experimentId, variableId);
      if (!isUniqueColumnsTitle) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          validationError: [{ property: 'columns.title', validationErrorTypeCode: ValidationErrorTypeEnum.IS_UNIQUE }],
        });
      }
    }

    const columnsSetOption: object = {};
    const columnsArrayFiltersOption: object[] = [];

    if (dto?.columns) {
      let counter = 0;

      for (const el of dto.columns) {
        if (el?.content) {
          if (el.content?.length !== variableArraysLength) {
            throw new CustomException({
              statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
              errorTypeCode: CustomErrorTypeEnum.VARIABLE_ARRAY_LENGTH_NOT_CORRECT,
            });
          }
          columnsSetOption[`columns.$[el${counter}].content`] = el.content;
        }
        if (el?.title) columnsSetOption[`columns.$[el${counter}].title`] = el.title;

        columnsArrayFiltersOption.push({ [`el${counter}._id`]: el._id });

        counter++;
      }
    }

    try {
      if (columnsArrayFiltersOption?.length) {
        await this.variableModel.updateOne(
          { _id: variableId },
          { ...variableDataForUpdateObj, $set: columnsSetOption },
          { arrayFilters: columnsArrayFiltersOption },
        );
      } else {
        await this.variableModel.updateOne({ _id: variableId }, variableDataForUpdateObj);
      }

      return {
        statusCode: HttpStatus.OK,
      };
    } catch (e) {
      console.log(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  public async delete(dto: DeleteVariableDto, userId: string): Promise<CustomResponseType> {
    const mongoTransactionSession = await this.connection.startSession();
    const postgresQueryRunner = PostgresDataSource.createQueryRunner();

    try {
      await mongoTransactionSession.startTransaction();
      await postgresQueryRunner.connect().then(async () => await postgresQueryRunner.startTransaction());

      for (const variableId of dto.variables) {
        const variableModel = await this.variableModel.findById({ _id: variableId }, { experimentId: true }).session(mongoTransactionSession);
        if (!variableModel) {
          throw CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND;
        }
        const experimentEntity = await postgresQueryRunner.manager.findOne(ExperimentEntity, {
          where: {
            id: variableModel.experimentId,
            user: {
              id: userId,
            },
          },
          select: {
            id: true,
            status: true,
            requestedParametersRespondentData: true,
          },
        });
        if (!experimentEntity) {
          throw CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND;
        }
        if (experimentEntity.status === ExperimentStatusEnum.PUBLISHED || experimentEntity.status === ExperimentStatusEnum.RESTRICTED) {
          throw new CustomException({
            statusCode: HttpStatus.FORBIDDEN,
            errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_CAN_NOT_UPDATE_PUBLISHED,
          });
        }

        const preparedRequestedParametersRespondentData = experimentEntity.requestedParametersRespondentData.reduce((result, element) => {
          if (element.variableId !== variableId) {
            result.push(element);
          }
          return result;
        }, []);

        await postgresQueryRunner.manager.update(
          ExperimentEntity,
          { id: variableModel.experimentId },
          { requestedParametersRespondentData: preparedRequestedParametersRespondentData },
        );
        await this.variableModel.deleteOne({ _id: variableId }).session(mongoTransactionSession);
      }
      await mongoTransactionSession.commitTransaction();
      await postgresQueryRunner.commitTransaction();
      return {
        statusCode: HttpStatus.NO_CONTENT,
      };
    } catch (e) {
      await mongoTransactionSession.abortTransaction();
      await postgresQueryRunner.rollbackTransaction();
      if (e === CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND) {
        throw new CustomException({
          statusCode: HttpStatus.FORBIDDEN,
          errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
        });
      }
      console.log(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } finally {
      await mongoTransactionSession.endSession();
      await postgresQueryRunner.release();
    }
  }

  public async readManyByExperiment(experimentId: string): Promise<CustomResponseType> {
    const experimentEntity = await this.experimentsRepository.findOne({
      where: {
        id: experimentId,
      },
      select: {
        id: true,
      },
    });
    if (!experimentEntity) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }
    const variablesSchema = await this.variableModel.find({ experimentId: experimentId }).select({ experimentId: false, slidesUsed: false });
    return {
      statusCode: HttpStatus.OK,
      data: {
        variables: variablesSchema,
      },
    };
  }

  public async addColumns(dto: AddColumnsDto, userId: string, variableId: string): Promise<CustomResponseType> {
    const variableModel = await this.variableModel.findById(variableId, { _id: true, value: true, experimentId: true }).exec();
    if (!variableModel) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const checkExperimentAccess = await CheckExperimentAccess(variableModel.experimentId, userId, ExperimentAccessByEnum.EXPERIMENT, true);
    if (checkExperimentAccess === ExperimentAccessStatusEnum.NO_USER_ACCESS) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    } else if (checkExperimentAccess === ExperimentAccessStatusEnum.NO_STATUS_ACCESS) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_CAN_NOT_UPDATE_PUBLISHED,
      });
    }

    const isUniqueColumnsTitle = await this.checkIsUnique(
      'columns.title',
      dto.columns.map(({ title }) => title),
      variableModel.experimentId,
      variableId,
    );
    if (!isUniqueColumnsTitle) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validationError: [{ property: 'columns.title', validationErrorTypeCode: ValidationErrorTypeEnum.IS_UNIQUE }],
      });
    }

    for (const el of dto.columns) {
      if (el.content?.length !== variableModel.value.content?.length) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          errorTypeCode: CustomErrorTypeEnum.VARIABLE_ARRAY_LENGTH_NOT_CORRECT,
        });
      }
    }
    await this.variableModel
      .updateOne(
        {
          _id: variableId,
          experimentId: variableModel.experimentId,
        },
        { $addToSet: { columns: { $each: dto.columns } } },
      )
      .exec();
    const [addedColumns] = await this.variableModel
      .aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(variableId) } },
        {
          $project: {
            _id: 0,
            columns: {
              $map: {
                input: {
                  $filter: {
                    input: '$columns',
                    as: 'el',
                    cond: { $in: ['$$el.title', dto.columns.map(({ title }) => title)] },
                  },
                },
                as: 'element',
                in: { _id: '$$element._id', title: '$$element.title' },
              },
            },
          },
        },
      ])
      .exec();
    return {
      statusCode: HttpStatus.OK,
      data: { variables: addedColumns.columns },
    };
  }

  public async addRows(dto: AddRowsDto, userId: string, variableId: string): Promise<CustomResponseType> {
    const variableModel = await this.variableModel.findById(variableId, { columns: true, experimentId: true }).exec();
    if (!variableModel) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const checkExperimentAccess = await CheckExperimentAccess(variableModel.experimentId, userId, ExperimentAccessByEnum.EXPERIMENT, true);
    if (checkExperimentAccess === ExperimentAccessStatusEnum.NO_USER_ACCESS) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    } else if (checkExperimentAccess === ExperimentAccessStatusEnum.NO_STATUS_ACCESS) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_CAN_NOT_UPDATE_PUBLISHED,
      });
    }

    if (!lod.isEqual(lod.sortBy(lod.map(lod.uniqBy(dto.columns, '_id'), '_id')), lod.sortBy(variableModel.columns.map((o) => String(o['_id']))))) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorTypeCode: CustomErrorTypeEnum.VARIABLE_NOT_ALL_COLUMNS_SET,
      });
    }
    const variableData = [];
    for (const el of dto.columns) {
      variableData.push({
        updateOne: {
          filter: { _id: variableId, 'columns._id': el._id },
          update: { $push: { 'columns.$.content': { $each: el.content } } },
        },
      });
    }
    variableData.push({
      updateOne: {
        filter: { _id: variableId },
        update: { $push: { 'value.content': { $each: dto.value } } },
      },
    });
    await this.variableModel.bulkWrite(variableData);
    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async removeRows(dto: RemoveRowsDto, userId: string, variableId: string): Promise<CustomResponseType> {
    const variableModel = await this.variableModel.findById(variableId, { _id: true, columns: true, experimentId: true }).exec();
    if (!variableModel) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const checkExperimentAccess = await CheckExperimentAccess(variableModel.experimentId, userId, ExperimentAccessByEnum.EXPERIMENT, true);
    if (checkExperimentAccess === ExperimentAccessStatusEnum.NO_USER_ACCESS) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    } else if (checkExperimentAccess === ExperimentAccessStatusEnum.NO_STATUS_ACCESS) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_CAN_NOT_UPDATE_PUBLISHED,
      });
    }

    const variableData = {};
    for (const el of dto.indexes) {
      const tmpVal = `value.content.${el}`;
      const tmp = `columns.$[].content.${el}`;
      variableData[tmp] = '';
      variableData[tmpVal] = '';
    }
    const mongoTransactionSession = await this.connection.startSession();
    await mongoTransactionSession.startTransaction();
    try {
      await this.variableModel.updateOne({ _id: variableId }, { $unset: { ...variableData } }).session(mongoTransactionSession);
      await this.variableModel
        .updateOne(
          { _id: variableId },
          {
            $pull: {
              'value.content': null,
              'columns.$[].content': null,
            },
          },
        )
        .session(mongoTransactionSession);
      await mongoTransactionSession.commitTransaction();
    } catch (e) {
      await mongoTransactionSession.abortTransaction();
      console.log(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } finally {
      await mongoTransactionSession.endSession();
    }
    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async removeColumns(dto: RemoveColumnsDto, userId: string, variableId: string): Promise<CustomResponseType> {
    const [variableModel] = await this.variableModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(variableId) } },
      {
        $project: {
          experimentId: 1,
          columnCount: { $size: '$columns' },
        },
      },
    ]);
    if (!variableModel) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const checkExperimentAccess = await CheckExperimentAccess(variableModel.experimentId, userId, ExperimentAccessByEnum.EXPERIMENT, true);
    if (checkExperimentAccess === ExperimentAccessStatusEnum.NO_USER_ACCESS) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    } else if (checkExperimentAccess === ExperimentAccessStatusEnum.NO_STATUS_ACCESS) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_CAN_NOT_UPDATE_PUBLISHED,
      });
    }

    if (dto.ids.length > variableModel.columnCount - 1) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorTypeCode: CustomErrorTypeEnum.VARIABLE_CAN_NOT_REMOVE_ALL_ATTRIBUTES,
      });
    }
    await this.variableModel.updateOne(
      { _id: variableId, 'columns._id': { $in: dto.ids } },
      { $pull: { columns: { _id: { $in: dto.ids } } } },
      { multi: true, upsert: false },
    );
    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async readById(variableId: string, userId: string): Promise<CustomResponseType> {
    const variableModel = await this.variableModel.findById(variableId, { experimentId: false, slidesUsed: false }).exec();
    if (!variableModel) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }
    // const experimentEntity = await this.experimentsRepository.findOne({
    //   where: {
    //     id: variableModel.experimentId,
    //     user: {
    //       id: userId,
    //     },
    //   },
    //   select: {
    //     id: true,
    //   },
    // });
    // if (!experimentEntity) {
    //   throw new CustomException({
    //     statusCode: HttpStatus.FORBIDDEN,
    //     errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
    //   });
    // }
    delete variableModel.experimentId;
    return {
      statusCode: HttpStatus.OK,
      data: variableModel,
    };
  }

  private async checkIsUnique(field: string, data: string[], experimentId?: string, variableId?: string) {
    const whereOption: object = { [field]: { $in: data } };
    if (variableId) whereOption['_id'] = variableId;
    if (experimentId) whereOption['experimentId'] = experimentId;
    const count = await this.variableModel.count(whereOption);
    return !count;
  }
}
