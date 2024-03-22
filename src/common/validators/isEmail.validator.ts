import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'regexValidator', async: true })
export class IsEmailValidator implements ValidatorConstraintInterface {
  validate(text: string) {
    const regex = /^[A-Za-z\d.@]*$/;
    return regex.exec(text) !== null;
  }
}
