import { Injectable, PipeTransform } from '@nestjs/common';
import { ValidationErrorTypeEnum } from '../enums/errorType.enum';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ValidationNumberParamPipe implements PipeTransform {
  async transform(value: number): Promise<number> {
    const tmp = Number(value);
    if (!!value && typeof tmp === 'number' && tmp > 0) {
      return value;
    }
    throw new ValidationException([{ property: 'number', validationErrorTypeCode: ValidationErrorTypeEnum.IS_NUMBER }]);
  }
}
