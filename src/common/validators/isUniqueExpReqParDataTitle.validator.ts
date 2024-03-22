import { HttpStatus } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { uniqBy } from 'lodash';
import { UpdateExperimentRequestedParametersRespondentDataDto } from 'src/modules/app/experiment/dto/updateExperiment.dto';
import { ValidationErrorTypeEnum } from '../enums/errorType.enum';
import { CustomException } from '../exceptions/custom.exception';

@ValidatorConstraint({ name: 'isUniqueExpReqParDataTitle', async: true })
export class IsUniqueExpReqParDataTitle implements ValidatorConstraintInterface {
  validate(data: UpdateExperimentRequestedParametersRespondentDataDto[]) {
    if (data && uniqBy(data, 'title').length !== data.length) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validationError: [{ validationErrorTypeCode: ValidationErrorTypeEnum.IS_UNIQUE, property: 'title' }],
      });
    }
    return true;
  }
}
