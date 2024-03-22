import { isArray, registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { VariableColumn, VariableValue } from '../../../modules/app/database/entities/variable.schema';

@ValidatorConstraint({ name: 'isValidVariableArraysLength', async: false })
export class IsValidVariableArraysLengthConstraint implements ValidatorConstraintInterface {
  validate(value: VariableValue | string[], args: ValidationArguments): boolean {
    const columns = args.object['columns'] as VariableColumn[];
    if (!columns) {
      return true;
    }
    if (!isArray(columns)) {
      return false;
    }
    const [valueIsArray] = args.constraints;
    const valueLength = ((): number => {
      if (valueIsArray) {
        const tmp = value as string[];
        return tmp?.length;
      } else {
        const tmp = value as VariableValue;
        return tmp.content?.length;
      }
    })();
    if (!valueLength) {
      return false;
    }

    for (const el of columns) {
      if (el.content?.length !== valueLength) {
        return false;
      }
    }
    return true;
  }
}

export function IsValidVariableArraysLength(valueIsArray?, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [valueIsArray],
      validator: IsValidVariableArraysLengthConstraint,
    });
  };
}
