import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isDuplicateInArray } from '../functions/isDuplicateInArray.function';

@ValidatorConstraint({ name: 'isUniqueArrayOfString', async: false })
export class IsUniqueArrayOfStringConstraint implements ValidatorConstraintInterface {
  validate(value: string[], args: ValidationArguments) {
    const [property] = args.constraints;
    if (property) {
      return !isDuplicateInArray(value.map(({ [property]: field }) => field).filter(Boolean));
    }
    return !isDuplicateInArray(value);
  }
}

export function IsUniqueArrayOfString(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsUniqueArrayOfStringConstraint,
    });
  };
}
