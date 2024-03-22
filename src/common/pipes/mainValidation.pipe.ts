import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';
import getErrorsArrayFunction from '../functions/getErrorsArray.function';
import { CustomResponseTypeError } from '../types/customResponseType';

@Injectable()
export class MainValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata): Promise<CustomResponseTypeError | Array<string>> {
    if (metadata.type == 'custom') {
      return value;
    }
    const entity = plainToInstance(metadata.metatype, value);
    const errors = await validate(entity, {
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      forbidUnknownValues: false,
    });
    if (errors?.length) {
      throw new ValidationException(getErrorsArrayFunction(errors));
    }
    return entity;
  }
}
