import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { PostgresDataSource } from 'src/common/configs/typeorm.config';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { CustomResponseType } from 'src/common/types/customResponseType';
import { isEmptyObject } from 'src/common/validators/isEmptyObject.validator';
import { ObjectLiteral, Repository } from 'typeorm';
import { CustomErrorTypeEnum } from '../../../common/enums/errorType.enum';
import { Variable, VariableDocument } from '../database/entities/mongo/variable.schema';
import { RowEntity } from '../database/entities/postgres/row.entity';
import { CycleChildEntity, SlideEntity, cycleChildEntityBaseSelectOptions, slideEntityBaseSelectOptions } from '../database/entities/postgres/slide.entity';
import { UpdateCycleChildDto } from './dto/cycle/updateCycleChild.dto';
import { UpdateAllSlidesColor } from './dto/updateAllSlidesColor.dto';
import { UpdateSlideDto } from './dto/updateSlide.dto';

@Injectable()
export class SlideService {
  constructor(
    @InjectModel(Variable.name) private readonly variableModel: Model<VariableDocument>,
    @InjectRepository(SlideEntity)
    private readonly slidesRepository: Repository<SlideEntity>,
    @InjectRepository(CycleChildEntity)
    private readonly cycleChildRepository: Repository<CycleChildEntity>,
    @InjectRepository(RowEntity)
    private readonly rowsRepository: Repository<RowEntity>,
  ) {}

  public async create(experimentId: string, isCycle?: boolean): Promise<CustomResponseType> {
    const slideEntityArr = await this.slidesRepository.find({
      where: {
        experiment: {
          id: experimentId,
        },
      },
      select: {
        position: true,
      },
    });
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
    const { identifiers } = await this.slidesRepository.insert({
      ...slideData,
      position: slidePosition,
      experiment: { id: experimentId },
    });
    return {
      statusCode: HttpStatus.CREATED,
      data: { ...(await this.getById(identifiers[0].id)) },
    };
  }

  public async readById(id: string): Promise<CustomResponseType> {
    const slideEntity = await this.slidesRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        ...slideEntityBaseSelectOptions,
      },
    });

    if (!slideEntity) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const rowsEntity = await this.rowsRepository.find({
      where: {
        slide: { id },
      },
      relations: {
        slide: true,
      },
      select: {
        id: true,
        height: true,
        maxColumn: true,
        position: true,
        elements: true,
        slide: {
          id: true,
        },
      },
    });

    rowsEntity.forEach((element) => delete element.slide);

    return {
      statusCode: HttpStatus.OK,
      data: {
        slide: { ...slideEntity, rows: rowsEntity },
      },
    };
  }

  public async updateSlide(dto: UpdateSlideDto, slideId: string): Promise<CustomResponseType> {
    isEmptyObject(dto);

    const slideEntity = await this.slidesRepository.findOne({
      where: {
        id: slideId,
      },
      relations: {
        experiment: true,
      },
      select: {
        id: true,
        isCycle: true,
        position: true,
        training: true,
        experiment: {
          id: true,
        },
      },
    });
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
      const variableModel = await this.variableModel.countDocuments({ _id: dto.variableId, experimentId: slideEntity.experiment.id });
      if (!variableModel) {
        throw new CustomException({
          statusCode: HttpStatus.FORBIDDEN,
          errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
        });
      }
    }

    const queryRunner = PostgresDataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (dto?.position) {
        const isUpdated = await queryRunner.manager.update(
          SlideEntity,
          { position: dto.position, experiment: { id: slideEntity.experiment.id } },
          { position: slideEntity.position },
        );
        if (isUpdated.affected === 0) {
          throw CustomErrorTypeEnum.SLIDE_POSITION_NOT_FOUND;
        } else if (isUpdated.affected > 1) {
          throw Error();
        }
      }

      await queryRunner.manager.update(SlideEntity, { id: slideId }, dto);

      if (dto.training) {
        await queryRunner.manager.update(CycleChildEntity, { cycle: slideId }, { training: true });
      } else {
        await queryRunner.manager.update(CycleChildEntity, { cycle: slideId }, { training: false });
      }

      await queryRunner.commitTransaction();
      return {
        statusCode: HttpStatus.OK,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (e === CustomErrorTypeEnum.SLIDE_POSITION_NOT_FOUND) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          errorTypeCode: CustomErrorTypeEnum.SLIDE_POSITION_NOT_FOUND,
        });
      }
      console.log(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } finally {
      await queryRunner.release();
    }
  }

  public async delete(id: string): Promise<CustomResponseType> {
    const slideEntity = await this.slidesRepository.findOne({
      where: {
        id,
      },
      relations: {
        experiment: true,
      },
      select: {
        id: true,
        position: true,
        isCycle: true,
        experiment: {
          id: true,
        },
      },
    });
    if (!slideEntity) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const numberOfSlides = await this.slidesRepository.findAndCount({
      where: {
        experiment: {
          id: slideEntity.experiment.id,
        },
      },
    });

    if (numberOfSlides[1] === 1) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorTypeCode: CustomErrorTypeEnum.CAN_NOT_DELETE_LAST_SLIDE,
      });
    }

    const queryRunner = PostgresDataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.manager.delete(SlideEntity, { id });

      const slidesEntity = await queryRunner.manager.find(SlideEntity, {
        where: {
          experiment: {
            id: slideEntity.experiment.id,
          },
        },
        select: {
          id: true,
          position: true,
        },
      });

      for (const element of slidesEntity) {
        if (element.position > slideEntity.position) {
          element.position = --element.position;

          await queryRunner.manager.update(
            SlideEntity,
            { id: element.id },
            {
              position: element.position,
            },
          );
        }
      }

      await queryRunner.commitTransaction();

      return {
        statusCode: HttpStatus.OK,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } finally {
      await queryRunner.release();
    }
  }

  public async updateAllSlidesColor(dto: UpdateAllSlidesColor, experimentId: string): Promise<CustomResponseType> {
    try {
      await PostgresDataSource.manager.transaction(async (transactionalEntityManager): Promise<void> => {
        await transactionalEntityManager.update(SlideEntity, { experiment: { id: experimentId } }, { colorCode: dto.colorCode });
        await transactionalEntityManager.update(CycleChildEntity, { experiment: { id: experimentId } }, { colorCode: dto.colorCode });
      });

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

  /* Cycle */
  public async createCycleChild(slideId: string): Promise<CustomResponseType> {
    const slideEntity = await this.slidesRepository.findOne({
      where: {
        id: slideId,
        isCycle: true,
      },
      relations: {
        experiment: true,
      },
      select: {
        id: true,
        training: true,
        experiment: {
          id: true,
        },
      },
    });
    if (!slideEntity) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }
    const cycleChildArr = await this.cycleChildRepository.find({
      where: {
        cycle: {
          id: slideId,
        },
      },
      select: {
        position: true,
        training: true,
      },
    });
    let slidePosition = 1;
    if (cycleChildArr && cycleChildArr?.length > 0) {
      slidePosition = 1 + Math.max(...cycleChildArr.map((element) => element.position));
    }
    cycleChildArr.forEach((el) => {
      if (el.position === slidePosition) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          errorTypeCode: CustomErrorTypeEnum.POSITION_ALREADY_EXISTS,
        });
      }
    });

    let identifiers: ObjectLiteral;

    if (slideEntity.training) {
      identifiers = await this.cycleChildRepository.insert({
        title: `Slide ${slidePosition}`,
        position: slidePosition,
        cycle: { id: slideId },
        training: true,
        experiment: { id: slideEntity.experiment.id },
      });
    } else {
      identifiers = await this.cycleChildRepository.insert({
        title: `Slide ${slidePosition}`,
        position: slidePosition,
        cycle: { id: slideId },
        experiment: { id: slideEntity.experiment.id },
      });
    }

    //TODO: fix typing
    return {
      statusCode: HttpStatus.CREATED,
      data: { ...(await this.getByIdCycleChild(identifiers['identifiers'][0].id)) },
    };
  }

  public async updateCycleChild(dto: UpdateCycleChildDto, childId: string, userId: string): Promise<CustomResponseType> {
    isEmptyObject(dto);
    const childEntity = await this.cycleChildRepository.findOne({
      where: {
        id: childId,
        cycle: {
          experiment: {
            user: {
              id: userId,
            },
          },
        },
      },
      relations: {
        cycle: true,
      },
      select: {
        id: true,
        position: true,
        cycle: {
          id: true,
        },
      },
    });
    if (!childEntity) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const queryRunner = PostgresDataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (dto?.position) {
        const isUpdated = await queryRunner.manager.update(
          CycleChildEntity,
          {
            position: dto.position,
            cycle: { id: childEntity.cycle.id },
          },
          { position: childEntity.position },
        );
        if (isUpdated.affected === 0) {
          throw CustomErrorTypeEnum.SLIDE_POSITION_NOT_FOUND;
        } else if (isUpdated.affected > 1) {
          throw Error();
        }
      }

      await queryRunner.manager.update(CycleChildEntity, { id: childId }, dto);

      await queryRunner.commitTransaction();
      return {
        statusCode: HttpStatus.OK,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (e === CustomErrorTypeEnum.SLIDE_POSITION_NOT_FOUND) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          errorTypeCode: CustomErrorTypeEnum.SLIDE_POSITION_NOT_FOUND,
        });
      }
      console.log(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } finally {
      await queryRunner.release();
    }
  }

  public async deleteCycleChild(childId: string): Promise<CustomResponseType> {
    const childEntity = await this.cycleChildRepository.findOne({
      where: {
        id: childId,
      },
      relations: {
        cycle: {
          experiment: true,
        },
      },
      select: {
        id: true,
        position: true,
        cycle: {
          id: true,
          experiment: {
            id: true,
          },
        },
      },
    });
    if (!childEntity) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    const queryRunner = PostgresDataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.manager.delete(CycleChildEntity, { id: childId });

      const cycleChildEntities = await this.cycleChildRepository.find({
        where: {
          cycle: {
            id: childEntity.cycle.id,
          },
        },
        select: {
          id: true,
          position: true,
        },
      });

      for (const element of cycleChildEntities) {
        if (element.position > childEntity.position) {
          element.position = --element.position;
          await queryRunner.manager.update(
            CycleChildEntity,
            { id: element.id },
            {
              position: element.position,
            },
          );
        }
      }
      await queryRunner.commitTransaction();
      return {
        statusCode: HttpStatus.NO_CONTENT,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } finally {
      await queryRunner.release();
    }
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

  private async getByIdCycleChild(childId: string): Promise<CycleChildEntity> {
    return await this.cycleChildRepository.findOne({
      where: {
        id: childId,
      },
      relations: {
        rows: true,
        cycle: true,
      },
      select: {
        ...cycleChildEntityBaseSelectOptions,
        rows: true,
        cycle: { id: true },
      },
    });
  }

  private async getById(slideId: string): Promise<SlideEntity> {
    return await this.slidesRepository.findOne({
      where: {
        id: slideId,
      },
      relations: {
        rows: true,
        children: {
          rows: true,
        },
      },
      select: {
        ...slideEntityBaseSelectOptions,
        rows: true,
        children: {
          ...cycleChildEntityBaseSelectOptions,
          rows: true,
        },
      },
    });
  }
}
