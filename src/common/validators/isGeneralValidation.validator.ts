import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'regexValidator', async: false })
export class IsGeneralValidationValidator implements ValidatorConstraintInterface {
  validate(text: string) {
    const regex = /[\p{Letter}\p{Mark}0-9()"«»|.,:;?!*+%-<>@\[\]{}_$#~  ]+$/u;
    return regex.exec(text) !== null;
  }
}
