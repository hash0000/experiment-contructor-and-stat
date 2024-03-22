import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { CountryCode } from 'libphonenumber-js/types';

export function IsValidPhone(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      async: false,
      validator: {
        validate(value: string, args: ValidationArguments): boolean {
          const [property] = args.constraints;
          const countryCode: CountryCode = (args.object as object)[property];
          if (!countryCode) {
            return false;
          }

          return isValidPhoneNumber(value, countryCode);
        },
      },
    });
  };
}
