import { Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { ValidationErrorTypeEnum } from '../enums/errorType.enum';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform {
  return;
  value;

  async transform(value: string): Promise<string> {
    const validObjectId = Types.ObjectId.isValid(value);

    if (!!value && !!validObjectId) {
      return value;
    }
    throw new ValidationException([{ property: 'id', validationErrorTypeCode: ValidationErrorTypeEnum.IS_MONGO_ID }]);
  }
}
