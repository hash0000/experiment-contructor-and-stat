import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'regexValidator', async: true })
export class IsUserName implements ValidatorConstraintInterface {
  validate(text: string) {
    const regex = /^[a-zA-Zа-яёА-ЯЁ]+(([`. -][a-zA-Zа-яёА-ЯЁ  ])?[a-zA-Zа-яёА-ЯЁ]*)*$/;
    return regex.exec(text) !== null;
  }
}
