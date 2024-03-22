import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'regexValidator', async: true })
export class IsPasswordValidator implements ValidatorConstraintInterface {
  validate(text: string) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@\[\]{}_$#~()"«»|<.,>:;\-?!*+%])[A-Za-z\d@\[\]{}_$#~()"«»|<.,>:;\-?!*+%  ]*$/;
    return regex.exec(text) !== null;
  }
}
