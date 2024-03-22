import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isExistsTitleOrContentInObject', async: false })
export class IsExistsTitleOrContentInObjectConstraint implements ValidatorConstraintInterface {
  validate(value: object) {
    if (!value['title'] && !value['content']) {
      return false;
    }
    return true;
  }
}

export function IsExistsTitleOrContentInObject(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsExistsTitleOrContentInObjectConstraint,
    });
  };
}
