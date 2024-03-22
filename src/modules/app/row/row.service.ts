import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresDataSource } from 'src/common/configs/typeorm.config';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { CustomResponseType } from 'src/common/types/customResponseType';
import { CycleChildEntity, SlideEntity } from 'src/modules/app/database/entities/postgres/slide.entity';
import { Not, Repository } from 'typeorm';
import { CustomErrorTypeEnum, ValidationErrorTypeEnum } from '../../../common/enums/errorType.enum';
import { ButtonElement } from '../database/entities/buttonElement';
import { RowElementEnum, RowEntity, RowMaxColumnEnum } from '../database/entities/postgres/row.entity';
import { SliderElement } from '../database/entities/sliderElement';
import { TextFieldElement } from '../database/entities/textFieldElement';
import { CreateRowDto } from './dto/createRow.dto';
import { CreateRowElementDto } from './dto/createRowElement.dto';
import { UpdateRowElementsDto } from './dto/updateRowElements.dto';
import { TextInputElement } from '../database/entities/textInputElement';

@Injectable()
export class RowService {
  constructor(
    @InjectRepository(RowEntity)
    private readonly rowsRepository: Repository<RowEntity>,
    @InjectRepository(SlideEntity)
    private readonly slidesRepository: Repository<SlideEntity>,
  ) {}

  public async createRow(dto: CreateRowDto, id: string, isChild?: boolean): Promise<CustomResponseType> {
    let whereOptionRows: object = {};
    if (isChild) {
      whereOptionRows = { slideChild: { id } };
    } else {
      whereOptionRows = { slide: { id } };
    }
    const rowsEntity = await this.rowsRepository.find({
      where: whereOptionRows,
    });
    let newRowEntity: RowEntity = new RowEntity();
    newRowEntity.maxColumn = dto.maxColumn;

    if (isChild) {
      newRowEntity.slideChild = new CycleChildEntity();
      newRowEntity.slideChild.id = id;
    } else {
      newRowEntity.slide = new SlideEntity();
      newRowEntity.slide.id = id;
    }

    if (!!rowsEntity && rowsEntity.length > 0) {
      let lastPosition: number = Math.max(...rowsEntity.map((element) => element.position));
      newRowEntity.position = ++lastPosition;

      rowsEntity.forEach((element) => {
        if (element.position === newRowEntity.position) {
          throw new CustomException({
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            errorTypeCode: CustomErrorTypeEnum.ENTRY_ALREADY_EXISTS,
          });
        }
      });
      newRowEntity = await this.rowsRepository.save(newRowEntity);
    } else {
      newRowEntity = await this.rowsRepository.save(newRowEntity);
    }

    if (isChild) {
      delete newRowEntity.slideChild;
    } else {
      delete newRowEntity.slide;
    }

    return {
      statusCode: HttpStatus.CREATED,
      data: { row: newRowEntity },
    };
  }

  public async deleteRow(rowId: string, id?: string, isCycle?: boolean): Promise<CustomResponseType> {
    let whereOption: object;

    if (isCycle) {
      whereOption = { id: rowId, slideChild: { id } };
    } else {
      whereOption = { id: rowId };
    }

    const rowEntity = await this.rowsRepository.findOne({
      where: whereOption,
      relations: {
        slide: true,
        slideChild: true,
      },
      select: {
        id: true,
        position: true,
        slide: {
          id: true,
        },
        slideChild: {
          id: true,
        },
      },
    });

    if (!rowEntity) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    try {
      await this.rowsRepository.delete({ id: rowId });
    } catch (e) {
      console.log(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    let whereOptionRows: object;

    if (isCycle) {
      whereOptionRows = { slideChild: { id: rowEntity.slideChild.id } };
    } else {
      whereOptionRows = { slide: { id: rowEntity.slide.id } };
    }

    const rowsEntity = await this.rowsRepository.find({
      where: whereOptionRows,
      select: {
        id: true,
        position: true,
      },
    });

    try {
      for (const element of rowsEntity) {
        if (element.position > rowEntity.position) {
          element.position = --element.position;

          await this.rowsRepository.update(
            { id: element.id },
            {
              position: element.position,
            },
          );
        }
      }

      return {
        statusCode: HttpStatus.OK,
        data: {
          rows: rowsEntity,
        },
      };
    } catch (e) {
      console.log(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  public async deleteRows(id: string, isCycle?: boolean): Promise<CustomResponseType> {
    const queryRunner = PostgresDataSource.createQueryRunner();
    let whereOption: object;

    if (isCycle) {
      whereOption = { slideChild: { id } };
    } else {
      whereOption = { slide: { id } };
    }

    try {
      await queryRunner.connect().then(async () => await queryRunner.startTransaction());

      await queryRunner.manager.delete(RowEntity, whereOption);
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

  /* Slide elements */
  public async createRowElement(dto: CreateRowElementDto, rowId: string, isCycle?: boolean): Promise<CustomResponseType> {
    const rowEntity = await this.rowsRepository.findOne({
      where: {
        id: rowId,
      },
      relations: {
        slide: true,
        slideChild: true,
      },
      select: {
        id: true,
        maxColumn: true,
        elements: true,
        position: true,
        slide: {
          id: true,
        },
        slideChild: {
          id: true,
        },
      },
    });

    if (!rowEntity) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }

    if (dto.position > rowEntity.maxColumn) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorTypeCode: CustomErrorTypeEnum.ROW_POSITION_MORE_THAN_ALLOWED,
      });
    }

    if (dto.type === RowElementEnum.SLIDER && rowEntity.maxColumn !== 1) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorTypeCode: CustomErrorTypeEnum.SLIDER_NOT_ALLOWED_FOR_THIS_ROW,
      });
    }

    if (!!rowEntity.elements) {
      rowEntity.elements.forEach((element) => {
        if (element.style.position === dto.position) {
          throw new CustomException({
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            errorTypeCode: CustomErrorTypeEnum.POSITION_ALREADY_EXISTS,
          });
        }
      });
    }

    if (isCycle) {
      return await this.generateRowElement(rowEntity, dto, true);
    }

    return await this.generateRowElement(rowEntity, dto);
  }

  public async updateRowElements(dto: UpdateRowElementsDto, rowId: string, isCycle?: boolean): Promise<CustomResponseType> {
    const rowEntity = await this.rowsRepository.findOne({
      where: {
        id: rowId,
      },
      relations: {
        slide: true,
        slideChild: true,
      },
      select: {
        id: true,
        maxColumn: true,
        slide: {
          id: true,
        },
        slideChild: {
          id: true,
        },
      },
    });

    if (!rowEntity) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }
    if (dto.elements.length > rowEntity.maxColumn) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorTypeCode: CustomErrorTypeEnum.LIMIT_FOR_ELEMENTS_IN_ROW,
      });
    }

    if (rowEntity.maxColumn !== RowMaxColumnEnum.ONE && dto.elements.some((element) => element.type === RowElementEnum.SLIDER)) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorTypeCode: CustomErrorTypeEnum.SLIDER_NOT_ALLOWED_FOR_THIS_ROW,
      });
    }

    const dtoTitleArr = dto.elements.map(({ title }) => title);
    if (new Set(dtoTitleArr).size !== dtoTitleArr.length) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validationError: [{ property: 'title', validationErrorTypeCode: ValidationErrorTypeEnum.IS_UNIQUE }],
      });
    }

    let whereOption = {};
    if (isCycle) {
      whereOption = {
        id: Not(rowId),
        slideChild: {
          id: rowEntity.slideChild.id,
        },
      };
    } else {
      whereOption = {
        id: Not(rowId),
        slide: {
          id: rowEntity.slide.id,
        },
      };
    }

    const rowEntityArr = (
      await this.rowsRepository.find({
        where: whereOption,
        select: {
          id: true,
          elements: true,
        },
      })
    ).flatMap(({ elements }) => elements.map(({ title }) => title));

    if (rowEntityArr.some((r) => dtoTitleArr.includes(r))) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validationError: [{ property: 'title', validationErrorTypeCode: ValidationErrorTypeEnum.IS_UNIQUE }],
      });
    }

    try {
      const newElements = await this.rowsRepository
        .createQueryBuilder()
        .update({ elements: dto.elements })
        .where({
          id: rowId,
        })
        .returning(['elements'])
        .execute();

      return {
        statusCode: HttpStatus.OK,
        data: { elements: newElements.raw[0].elements },
      };
    } catch (e) {
      console.log(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  private async generateRowElement(rowEntity: RowEntity, dto: CreateRowElementDto, isCycle?: boolean): Promise<CustomResponseType> {
    const newRowElement = this.getElementClass(dto.type);
    newRowElement.style.position = dto.position;
    newRowElement.title = `${dto.type} ${rowEntity.position}${newRowElement.style.position}`;

    let whereOption = {};

    if (isCycle) {
      whereOption = { slideChild: { id: rowEntity.slideChild.id } };
    } else {
      whereOption = {
        slide: {
          id: rowEntity.slide.id,
        },
      };
    }

    const rowEntityArr = (
      await this.rowsRepository.find({
        where: whereOption,
        select: {
          id: true,
          elements: true,
        },
      })
    ).flatMap(({ elements }) => elements.map(({ title }) => title));

    let whileNotUnique = true;
    do {
      if (rowEntityArr.includes(newRowElement.title)) {
        newRowElement.title = newRowElement.title + (Math.random() + 1).toString(36).substring(10);
      } else {
        whileNotUnique = false;
      }
    } while (whileNotUnique);

    rowEntity.elements.push(newRowElement);

    rowEntity.elements.forEach((element) => {
      if (element.style.position > rowEntity.maxColumn) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          errorTypeCode: CustomErrorTypeEnum.LIMIT_FOR_ELEMENTS_IN_ROW,
        });
      }
    });

    try {
      const newEntity = await this.rowsRepository
        .createQueryBuilder()
        .update({ elements: rowEntity.elements })
        .where({
          id: rowEntity.id,
        })
        .returning(['id', 'height', 'maxColumn', 'position', 'elements'])
        .execute();

      return {
        statusCode: HttpStatus.OK,
        data: {
          row: { ...newEntity.raw[0], slide: rowEntity.slide },
        },
      };
    } catch (e) {
      console.log(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  private getElementClass(element: RowElementEnum): TextFieldElement | SliderElement | ButtonElement | TextInputElement {
    switch (element) {
      case RowElementEnum.TEXT:
        return new TextFieldElement();
      case RowElementEnum.SLIDER:
        return new SliderElement();
      case RowElementEnum.BUTTON:
        return new ButtonElement();
      case RowElementEnum.INPUT:
        return new TextInputElement();
      default:
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          errorTypeCode: CustomErrorTypeEnum.TYPE_OF_ELEMENT_NOT_ALLOWED,
        });
    }

    /* end Slide elements */
  }
}
