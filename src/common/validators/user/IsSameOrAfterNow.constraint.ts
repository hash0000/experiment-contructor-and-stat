import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import * as dayjs from 'dayjs';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

@ValidatorConstraint({ async: false, name: 'isAfterNow' })
export class IsSameOrAfterNowConstraint implements ValidatorConstraintInterface {
  validate(date: Date): boolean {
    dayjs.extend(isSameOrAfter);
    return dayjs().isSameOrAfter(dayjs(date));
  }
}

export function IsSameOrAfterNow(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSameOrAfterNowConstraint,
    });
  };
}
