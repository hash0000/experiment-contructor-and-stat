import { HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Validator, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ButtonElementDto } from 'src/modules/app/database/entities/dto/buttonElement.dto';
import { SliderElementDto } from 'src/modules/app/database/entities/dto/sliderElement.dto';
import { TextFieldElementDto } from 'src/modules/app/database/entities/dto/textFieldElement.dto';
import { RowElementEnum } from 'src/modules/app/database/entities/postgres/row.entity';
import { CustomErrorTypeEnum, ValidationErrorTypeEnum } from '../enums/errorType.enum';
import { CustomException } from '../exceptions/custom.exception';
import { ValidationException } from '../exceptions/validation.exception';
import getErrorsArrayFunction from '../functions/getErrorsArray.function';
import { isDuplicateInArray } from '../functions/isDuplicateInArray.function';

@ValidatorConstraint({ name: 'isValidRowElement', async: true })
export class IsValidRowElementValidator implements ValidatorConstraintInterface {
  async validate(value: Array<any>): Promise<boolean> {
    if (!!value && !!Array.isArray(value)) {
      const samePosArray = [];
      let counter = 0;
      for (const element of value) {
        counter++;
        switch (element.type) {
          case RowElementEnum.TEXT:
            const textErrors = await validateElement(TextFieldElementDto, element);

            if (textErrors?.length) {
              throw new ValidationException(getErrorsArrayFunction(textErrors, counter));
            }
            samePosArray.push(element.style.position);
            break;
          case RowElementEnum.SLIDER:
            const sliderErrors = await validateElement(SliderElementDto, element);
            if (sliderErrors?.length) {
              throw new ValidationException(getErrorsArrayFunction(sliderErrors, counter));
            }
            samePosArray.push(element.style.position);
            break;
          case RowElementEnum.BUTTON:
            const buttonErrors = await validateElement(ButtonElementDto, element);
            if (buttonErrors?.length) {
              throw new ValidationException(getErrorsArrayFunction(buttonErrors, counter));
            }
            samePosArray.push(element.style.position);
            break;
          default:
            throw new CustomException({
              statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
              errorTypeCode: CustomErrorTypeEnum.TYPE_OF_ELEMENT_NOT_ALLOWED,
            });
        }
      }
      if (!!isDuplicateInArray(samePosArray)) {
        throw new CustomException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          validationError: [{ property: 'position', validationErrorTypeCode: ValidationErrorTypeEnum.DUPLICATE_VALUE }],
        });
      }
    } else {
      return false;
    }
    return true;
  }
}

async function validateElement(dto: any, element: any) {
  const validator = new Validator();

  return await validator.validate(plainToInstance(dto, element), {
    whitelist: true,
    forbidNonWhitelisted: true,
    stopAtFirstError: true,
  });
}
