import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { accessConditionsConditionEnum, accessConditionsOperatorEnum } from 'src/modules/app/database/entities/postgres/experiment.entity';
import { UpdateExperimentAccessConditionsDto } from 'src/modules/app/experiment/dto/updateExperiment.dto';

export function IsValidExperimentConditionsOperator(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidExperimentConditionsOperator',
      async: false,
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: accessConditionsOperatorEnum, args: ValidationArguments) {
          const dto = args.object as UpdateExperimentAccessConditionsDto;
          return !(
            dto.condition !== accessConditionsConditionEnum.AGE &&
            value !== accessConditionsOperatorEnum.EQUALS &&
            value !== accessConditionsOperatorEnum.NOT_EQUALS
          );
        },
      },
    });
  };
}
