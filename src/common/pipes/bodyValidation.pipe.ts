import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';
import getErrorsArrayFunction from '../functions/getErrorsArray.function';

@Injectable()
export class BodyValidationPipe implements PipeTransform {
  async transform(value: any, { metatype, type }: ArgumentMetadata): Promise<Array<string>> {
    if (type !== 'body' && type !== 'query') {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      forbidUnknownValues: false,
    });
    if (errors?.length > 0) {
      throw new ValidationException(getErrorsArrayFunction(errors));
    }
    return object;
  }
}
