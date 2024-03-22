import { Injectable, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { ValidationErrorTypeEnum } from '../enums/errorType.enum';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ValidationUuidParamPipe implements PipeTransform {
  async transform(value: string): Promise<string> {
    if (!value || !isUUID(value, 4)) {
      throw new ValidationException([{ property: 'id', validationErrorTypeCode: ValidationErrorTypeEnum.IS_UUID }]);
    }
    return value;
  }
}
