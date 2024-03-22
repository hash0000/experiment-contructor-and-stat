import { HttpStatus } from '@nestjs/common';
import { ValidationErrorTypeEnum } from '../enums/errorType.enum';
import { CustomException } from '../exceptions/custom.exception';

export function trimTransformer(value: string | string[] | null, property: string): string | string[] | undefined | null {
  if (typeof value == 'string') {
    value = value.trim();
  } else if (Array.isArray(value)) {
    value = value.map((o: string) => o.trim());
  } else if (value === null) {
    return null;
  } else {
    throw new CustomException({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      validationError: [{ property: property, validationErrorTypeCode: ValidationErrorTypeEnum.IS_STRING_OR_NULL }],
    });
  }
  return value;
}
