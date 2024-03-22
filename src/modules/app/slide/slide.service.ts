import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { find } from 'lodash';
import mongoose, { Model } from 'mongoose';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { objectToDotNotation } from 'src/common/functions/objectToDotNotation.function';
import { CustomResponseType } from 'src/common/types/customResponseType';
import { Repository } from 'typeorm';
import { entityNameConstant } from '../../../common/constants/entityName.constant';
import { CustomErrorTypeEnum } from '../../../common/enums/errorType.enum';
import { MongoTransactionRunner } from '../../../common/functions/mongoTransactionRunner.function';
import { RowEntityP } from '../database/entities/postgres/row.entity';
import { CycleChildEntityP, SlideEntityP, cycleChildEntityBaseSelectOptions } from '../database/entities/postgres/slide.entity';
import { RowEntityDocument } from '../database/entities/row.entity';
import { SlideDocument } from '../database/entities/slide.entity';
import { SlideDescendantDocument } from '../database/entities/slideDescendant.entity';
import { VariableDocument } from '../database/entities/variable.schema';
import { UpdateCycleChildDto } from './dto/cycle/updateCycleChild.dto';
import { UpdateAllSlidesColor } from './dto/updateAllSlidesColor.dto';
import { UpdateSlideDto } from './dto/updateSlide.dto';

@Injectable()
export class SlideService {
  constructor(
    @InjectModel(entityNameConstant.VARIABLE) private readonly variableModel: Model<VariableDocument>,
    @InjectModel(entityNameConstant.SLIDE) private readonly slideModel: Model<SlideDocument>,
    @InjectModel(entityNameConstant.SLIDE_DESCENDANT) private readonly slideChildModel: Model<SlideDescendantDocument>,
    @InjectModel(entityNameConstant.ROW) private readonly rowModel: Model<RowEntityDocument>,
    @InjectConnection() private readonly mongoConnection: mongoose.Connection,
    @InjectRepository(SlideEntityP)
    private readonly slidesRepository: Repository<SlideEntityP>,
    @InjectRepository(CycleChildEntityP)
    private readonly cycleChildRepository: Repository<CycleChildEntityP>,
    @InjectRepository(RowEntityP)
    private readonly rowsRepository: Repository<RowEntityP>,
  ) {}

  public async create(experimentId: string, isCycle?: boolean): Promise<CustomResponseType> {
    const slideEntityArr = await this.slideModel
      .aggregate([
        {
          $lookup: {
            from: 'experiment',
            foreignField: '_id',
            localField: 'experiment',
            as: 'experiment',
          },
        },
        { $unwind: '$experiment' },
        {
          $match: {
            'experiment._id': new mongoose.Types.ObjectId(experimentId),
          },
        },
        {
          $project: {
            _id: true,
            position: true,
          },
        },
      ])
      .exec();

    let slidePosition = 1;
    if (slideEntityArr && slideEntityArr?.length > 0) {
      slidePosition = 1 + Math.max(...slideEntityArr.map((element) => element.position));
    }
    slideEntityArr.forEach((el) => {
      if (el.position === slidePosition) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          errorTypeCode: CustomErrorTypeEnum.POSITION_ALREADY_EXISTS,
        });
      }
    });
    const slideData = {
      title: `Slide ${slidePosition}`,
      isCycle: false,
    };
    if (isCycle) {
      slideData.title = `Cycle ${slidePosition}`;
      slideData.isCycle = true;
    }

    const newRecord = await new this.slideModel({ ...slideData, position: slidePosition, experiment: new mongoose.Types.ObjectId(experimentId) }).save();

    return {
      statusCode: HttpStatus.CREATED,
      data: newRecord,
    };
  }

  public async readById(slideId: string): Promise<CustomResponseType> {
    const slideEntity = await this.slideModel.findById(slideId).exec();

    if (!slideEntity) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      data: {
        slide: slideEntity,
      },
    };
  }

  public async updateSlide(dto: UpdateSlideDto, slideId: string): Promise<CustomResponseType> {
    const slideEntity = await this.slideModel
      .findById(slideId, {
        _id: true,
        isCycle: true,
        position: true,
        training: true,
      })
      .populate('experiment', { id: true })
      .exec();
    if (!slideEntity) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    if (dto?.variableId && slideEntity.isCycle === false) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorTypeCode: CustomErrorTypeEnum.VARIABLE_CAN_NOT_SED_TO_SLIDE,
      });
    } else if (dto?.variableId && slideEntity.isCycle === true) {
      const variableModel = await this.variableModel.count({ _id: dto.variableId, experimentId: slideEntity.experiment.id });
      if (!variableModel) {
        throw new CustomException({
          statusCode: HttpStatus.FORBIDDEN,
          errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
        });
      }
    }

    await MongoTransactionRunner(this.mongoConnection, async (session) => {
      if (dto?.position) {
        const isUpdated = await this.slideModel
          .updateOne({ position: dto.position, experiment: slideEntity.experiment._id }, { position: slideEntity.position })
          .session(session)
          .exec();
        if (isUpdated.modifiedCount === 0) {
          throw new CustomException({
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            errorTypeCode: CustomErrorTypeEnum.SLIDE_POSITION_NOT_FOUND,
          });
        } else if (isUpdated.modifiedCount > 1) {
          console.error('Error while slide update');
          throw new CustomException({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          });
        }
      }

      await this.slideModel.updateOne({ id: slideId }, dto).session(session).exec();

      if (dto.training) {
        await this.slideChildModel.updateOne({ slide: slideId }, { training: true }).session(session).exec();
      } else {
        await this.slideChildModel.updateOne({ slide: slideId }, { training: false }).session(session).exec();
      }
    });

    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async delete(slideId: string): Promise<CustomResponseType> {
    const slideEntity = await this.slideModel
      .findById(slideId, {
        _id: true,
        position: true,
        isCycle: true,
      })
      .populate('experiment', { _id: true })
      .exec();
    if (!slideEntity) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const numberOfSlides = await this.slideModel.countDocuments({
      experiment: {
        _id: slideEntity.experiment._id,
      },
    });

    if (numberOfSlides === 1) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorTypeCode: CustomErrorTypeEnum.CAN_NOT_DELETE_LAST_SLIDE,
      });
    }

    await MongoTransactionRunner(this.mongoConnection, async (session) => {
      await this.slideModel.deleteOne({ _id: slideId }).session(session).exec();

      const slidesEntity = await this.slideModel.find({ experiment: { _id: slideEntity.experiment._id } }, { _id: true, position: true }).exec();

      for (const element of slidesEntity) {
        if (element.position > slideEntity.position) {
          element.position = --element.position;

          await this.slideModel
            .updateOne(
              { _id: element._id },
              {
                position: element.position,
              },
            )
            .session(session)
            .exec();
        }
      }
    });

    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async updateAllSlidesColor(dto: UpdateAllSlidesColor, experimentId: string): Promise<CustomResponseType> {
    await this.slideModel
      .updateMany(
        { experiment: { _id: experimentId } },
        {
          $set: {
            colorCode: dto.colorCode,
            'descendants.$.colorCode': dto.colorCode,
          },
        },
      )
      .exec();

    return {
      statusCode: HttpStatus.OK,
    };
  }

  /* Descendant section */
  public async createCycleChild(slideId: string): Promise<CustomResponseType> {
    const slideEntity = await this.slideModel.findOne(
      {
        _id: slideId,
        isCycle: true,
      },
      { _id: true, training: true, experiment: true, descendants: { _id: true, position: true, training: true } },
    );
    if (!slideEntity) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    let slidePosition = 1;
    if (slideEntity.descendants.length > 0) {
      slidePosition = 1 + Math.max(...slideEntity.descendants.map(({ position }) => position));
    }
    slideEntity.descendants.forEach((el) => {
      if (el.position === slidePosition) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          errorTypeCode: CustomErrorTypeEnum.POSITION_ALREADY_EXISTS,
        });
      }
    });

    const slideDescendantEntity = await this.slideModel.findOneAndUpdate(
      { _id: slideId },
      {
        $push: {
          descendants: {
            title: `Slide ${slidePosition}`,
            position: slidePosition,
            training: slideEntity.training,
          },
        },
      },
      {
        new: true,
      },
    );

    const newSlideDescendantEntity = find(slideDescendantEntity.descendants, { position: slidePosition });

    if (!newSlideDescendantEntity) {
      console.error('Error while creating slide descendant.');
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return {
      statusCode: HttpStatus.CREATED,
      data: newSlideDescendantEntity,
    };
  }

  public async updateDescendant(dto: UpdateCycleChildDto, descendantId: string, userId: string): Promise<CustomResponseType> {
    const slideEntity = (
      await this.slideModel
        .aggregate([
          {
            $match: {
              descendants: { $elemMatch: { _id: new mongoose.Types.ObjectId(descendantId) } },
            },
          },
          {
            $project: { _id: true, experiment: true, descendants: { _id: true, position: true } },
          },
          {
            $lookup: {
              from: 'experiment',
              foreignField: '_id',
              localField: 'experiment',
              as: 'experiment',
              pipeline: [{ $project: { _id: true, user: true } }, { $match: { user: new mongoose.Types.ObjectId(userId) } }],
            },
          },
          { $unwind: '$experiment' },
        ])
        .exec()
    )[0];
    if (!slideEntity) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const descendantEntity = find(slideEntity.descendants, { _id: new mongoose.Types.ObjectId(descendantId) });
    if (!slideEntity) {
      console.error('Error while updating descendant. (0)');
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    await MongoTransactionRunner(this.mongoConnection, async (session) => {
      if (dto?.position) {
        const isUpdated = await this.slideModel
          .updateOne(
            {
              _id: slideEntity._id,
              descendants: { $elemMatch: { position: dto.position } },
            },
            { $set: { 'descendants.$.position': descendantEntity.position } },
          )
          .session(session)
          .exec();
        if (isUpdated.modifiedCount === 0) {
          throw new CustomException({
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            errorTypeCode: CustomErrorTypeEnum.SLIDE_POSITION_NOT_FOUND,
          });
        } else if (isUpdated.modifiedCount > 1) {
          console.error('Error while updating descendant. (1)');
          throw new CustomException({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          });
        }
      }

      await this.slideModel
        .updateOne(
          {
            _id: slideEntity._id,
            descendants: { $elemMatch: { _id: descendantId } },
          },
          { $set: objectToDotNotation('descendants', dto) },
        )
        .session(session)
        .exec();
    });

    return {
      statusCode: HttpStatus.OK,
    };
  }

  public async deleteDescendant(descendantId: string): Promise<CustomResponseType> {
    const slideEntity = (
      await this.slideModel
        .aggregate([
          {
            $match: {
              descendants: { $elemMatch: { _id: new mongoose.Types.ObjectId(descendantId) } },
            },
          },
          {
            $project: { _id: true, experiment: true, descendants: { _id: true, position: true } },
          },
          {
            $lookup: {
              from: 'experiment',
              foreignField: '_id',
              localField: 'experiment',
              as: 'experiment',
              pipeline: [{ $project: { _id: true, user: true } }],
            },
          },
          { $unwind: '$experiment' },
        ])
        .exec()
    )[0];
    if (!slideEntity) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const descendantEntity = find(slideEntity.descendants, { _id: new mongoose.Types.ObjectId(descendantId) });
    if (!descendantEntity) {
      console.error('Error while deleting descendant. (0)');
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    const bulkWriteArray = [];

    bulkWriteArray.push({
      updateOne: {
        filter: { _id: slideEntity._id },
        update: {
          $pull: {
            descendants: { _id: descendantEntity._id },
          },
        },
        upsert: false,
      },
    });

    for (const element of slideEntity.descendants) {
      if (element.position > descendantEntity.position) {
        element.position = --element.position;
        console.log(1);
        bulkWriteArray.push({
          updateOne: {
            filter: {
              _id: slideEntity._id,
              descendants: { $elemMatch: { _id: element._id } },
            },
            update: { $set: { 'descendants.$.position': element.position } },
          },
        });
      }
    }

    await this.slideModel.bulkWrite(bulkWriteArray, { throwOnValidationError: true, ordered: true });

    return {
      statusCode: HttpStatus.NO_CONTENT,
    };
  }

  public async readByIdCycleChild(id: string): Promise<CustomResponseType> {
    const childEntity = await this.cycleChildRepository.findOne({
      where: {
        id,
      },
      relations: {
        cycle: true,
      },
      select: {
        ...cycleChildEntityBaseSelectOptions,
        cycle: {
          id: true,
          variableId: true,
        },
      },
    });
    if (!childEntity) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const rowsEntity = await this.rowsRepository.find({
      where: {
        slideChild: { id },
      },
      select: {
        id: true,
        height: true,
        maxColumn: true,
        position: true,
        elements: true,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      data: { ...childEntity, rows: rowsEntity },
    };
  }
}
