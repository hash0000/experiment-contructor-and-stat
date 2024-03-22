import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isNotBlank', async: false })
export class IsNotBlankConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    if (value === null || value === undefined || value.trim() === '') {
      return false;
    }
    const [advanced] = args.constraints;
    if (advanced) {
      const regex = /(^\s+|\s+$)/;
      return regex.exec(value) === null;
    }
    return true;
  }
}

export function IsNotBlank(advanced = true, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [advanced],
      validator: IsNotBlankConstraint,
    });
  };
}
