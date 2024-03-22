import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import * as dayjs from 'dayjs';

export function IsDateFromNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateString',
      async: false,
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: number, args: ValidationArguments): boolean {
          return dayjs(value).isValid();
        },
      },
    });
  };
}
