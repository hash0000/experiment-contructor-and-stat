import { HttpStatus } from '@nestjs/common';
import { CustomErrorTypeEnum, ValidationErrorTypeEnum } from '../enums/errorType.enum';

export type CustomResponseType = {
  statusCode: HttpStatus;
  data?: object;
  errorTypeCode?: CustomErrorTypeEnum;
  validationError?: CustomResponseTypeError;
};

export type CustomResponseTypeError = Array<{ property?: string; validationErrorTypeCode: ValidationErrorTypeEnum }>;
