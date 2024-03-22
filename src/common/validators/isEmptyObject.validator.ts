import { HttpStatus } from '@nestjs/common';
import { ValidationErrorTypeEnum } from '../enums/errorType.enum';
import { CustomException } from '../exceptions/custom.exception';

export function isEmptyObject(property: object): void {
  if (Object.values(property).every((el) => el === undefined)) {
    throw new CustomException({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      validationError: [{ property: 'request body', validationErrorTypeCode: ValidationErrorTypeEnum.IS_NOT_EMPTY_OBJECT }],
    });
  }
}
