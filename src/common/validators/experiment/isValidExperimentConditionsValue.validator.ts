import { isNumberString, isUUID, registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import checkIsExists from 'src/common/functions/checkIsExists.function';
import { accessConditionsConditionEnum } from 'src/modules/app/database/entities/postgres/experiment.entity';
import { UserSexEnum } from 'src/modules/app/database/entities/postgres/user.entity';
import { UpdateExperimentAccessConditionsDto } from 'src/modules/app/experiment/dto/updateExperiment.dto';

export function IsValidExperimentConditionsValue(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidExperimentConditionsValue',
      async: true,
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        async validate(value: string, args: ValidationArguments): Promise<boolean> {
          const dto = args.object as UpdateExperimentAccessConditionsDto;
          if (dto.condition === accessConditionsConditionEnum.AGE && !isNumberString(value)) {
            return false;
          } else if (dto.condition === accessConditionsConditionEnum.SEX && !isNumberString(value) && !Object.values(UserSexEnum).includes(Number(value))) {
            return false;
          } else if (dto.condition === accessConditionsConditionEnum.LEARNED_LANGUAGE || dto.condition === accessConditionsConditionEnum.NATIVE_LANGUAGE) {
            if (!isUUID(value, 4)) {
              return false;
            }
            return await checkIsExists('Language', value, true);
          }
          return true;
        },
      },
    });
  };
}
