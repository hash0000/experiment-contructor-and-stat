import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'regexValidator', async: true })
export class IsUserCodeValidator implements ValidatorConstraintInterface {
  validate(text: string) {
    const regex = /^\d+$/;
    return regex.exec(text) !== null;
  }
}
