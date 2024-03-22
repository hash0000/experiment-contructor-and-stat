import { ValidationError } from 'class-validator';
import { ClassValidatorErrorNameEnum, ValidationErrorTypeEnum } from '../enums/errorType.enum';

import { CustomResponseTypeError } from '../types/customResponseType';

export default (validationErrors: Array<ValidationError>, elementPosition?: number): CustomResponseTypeError => {
  const errorSet = validationErrors.map((error) => getDownToError(error));
  const message = errorSet.flat();
  if (!!elementPosition) {
    return (message as CustomResponseTypeError).map((element) => ({
      property: `${element.property}-${elementPosition.toString()}`,
      validationErrorTypeCode: element.validationErrorTypeCode,
    }));
  }
  return message as CustomResponseTypeError;
};

function getDownToError(validationError: ValidationError, oldTraceStack = [], fromInside = false): object {
  const traceStack = [...oldTraceStack, validationError.property];
  if (!validationError.constraints) {
    return validationError.children.map((error) => getDownToError(error, traceStack, true)).flat();
  }
  return {
    property: fromInside ? traceStack.join('.').replaceAll('.0', '') : validationError.property,
    validationErrorTypeCode: getErrorTypeCode(Object.keys(validationError?.constraints).pop()),
  };
}

function getErrorTypeCode(errorType: string): ValidationErrorTypeEnum {
  switch (errorType) {
    case ClassValidatorErrorNameEnum.IS_DEFINED:
      return ValidationErrorTypeEnum.IS_DEFINED;
    case ClassValidatorErrorNameEnum.IS_NOT_EMPTY:
      return ValidationErrorTypeEnum.IS_NOT_EMPTY;
    case ClassValidatorErrorNameEnum.IS_VALID_REGEX:
      return ValidationErrorTypeEnum.IS_VALID_REGEX;
    case ClassValidatorErrorNameEnum.IS_VALID_ROW_ELEMENT:
      return ValidationErrorTypeEnum.IS_VALID_ROW_ELEMENT;
    case ClassValidatorErrorNameEnum.IS_STRING:
      return ValidationErrorTypeEnum.IS_STRING;
    case ClassValidatorErrorNameEnum.IS_UUID:
      return ValidationErrorTypeEnum.IS_UUID;
    case ClassValidatorErrorNameEnum.IS_ARRAY:
      return ValidationErrorTypeEnum.IS_ARRAY;
    case ClassValidatorErrorNameEnum.IS_EMAIL:
      return ValidationErrorTypeEnum.IS_EMAIL;
    case ClassValidatorErrorNameEnum.IS_HEX:
      return ValidationErrorTypeEnum.IS_HEX;
    case ClassValidatorErrorNameEnum.IS_BOOLEAN:
      return ValidationErrorTypeEnum.IS_BOOLEAN;
    case ClassValidatorErrorNameEnum.IS_OBJECT:
      return ValidationErrorTypeEnum.IS_OBJECT;
    case ClassValidatorErrorNameEnum.IS_NUMBER:
      return ValidationErrorTypeEnum.IS_NUMBER;
    case ClassValidatorErrorNameEnum.IS_ENUM:
      return ValidationErrorTypeEnum.IS_ENUM;
    case ClassValidatorErrorNameEnum.IS_LENGTH:
      return ValidationErrorTypeEnum.IS_LENGTH;
    case ClassValidatorErrorNameEnum.MAX:
      return ValidationErrorTypeEnum.MAX;
    case ClassValidatorErrorNameEnum.MIN:
      return ValidationErrorTypeEnum.MIN;
    case ClassValidatorErrorNameEnum.ARRAY_MAX_SIZE:
      return ValidationErrorTypeEnum.ARRAY_MAX_SIZE;
    case ClassValidatorErrorNameEnum.ARRAY_MIN_SIZE:
      return ValidationErrorTypeEnum.ARRAY_MIN_SIZE;
    case ClassValidatorErrorNameEnum.WHITE_LIST_VALIDATION:
      return ValidationErrorTypeEnum.WHITE_LIST_VALIDATION;
    case ClassValidatorErrorNameEnum.IS_NOT_EMPTY_ARRAY:
      return ValidationErrorTypeEnum.IS_NOT_EMPTY_ARRAY;
    case ClassValidatorErrorNameEnum.IS_TYPE:
      return ValidationErrorTypeEnum.IS_TYPE;
    case ClassValidatorErrorNameEnum.IS_IN:
      return ValidationErrorTypeEnum.IS_IN;
    case ClassValidatorErrorNameEnum.IS_DATE:
      return ValidationErrorTypeEnum.IS_DATE;
    case ClassValidatorErrorNameEnum.IS_PHONE:
      return ValidationErrorTypeEnum.IS_PHONE;
    case ClassValidatorErrorNameEnum.IS_URL:
      return ValidationErrorTypeEnum.IS_URL;
    case ClassValidatorErrorNameEnum.IS_MONGO_ID:
      return ValidationErrorTypeEnum.IS_MONGO_ID;
    case ClassValidatorErrorNameEnum.IS_VALID_ACCESS_CONDITION_OPERATOR:
      return ValidationErrorTypeEnum.IS_VALID_ACCESS_CONDITION_OPERATOR;
    case ClassValidatorErrorNameEnum.IS_VALID_ACCESS_CONDITION_VALUE:
      return ValidationErrorTypeEnum.IS_VALID_ACCESS_CONDITION_VALUE;
    case ClassValidatorErrorNameEnum.IS_AFTER_NOW:
      return ValidationErrorTypeEnum.IS_AFTER_NOW;
    case ClassValidatorErrorNameEnum.IS_VALID_VARIABLE_ARRAYS_LENGTH:
      return ValidationErrorTypeEnum.IS_VALID_VARIABLE_ARRAYS_LENGTH;
    case ClassValidatorErrorNameEnum.IS_UNIQUE_ARRAY_OF_STRING:
      return ValidationErrorTypeEnum.IS_UNIQUE_ARRAY_OF_STRING;
    case ClassValidatorErrorNameEnum.IS_NOT_BLANK:
      return ValidationErrorTypeEnum.IS_NOT_BLANK;
    case ClassValidatorErrorNameEnum.IS_EXISTS_TITLE_OR_CONTENT_IN_OBJECT:
      return ValidationErrorTypeEnum.IS_EXISTS_TITLE_OR_CONTENT_IN_OBJECT;
    case ClassValidatorErrorNameEnum.IS_POSITIVE:
      return ValidationErrorTypeEnum.IS_POSITIVE;
    case ClassValidatorErrorNameEnum.IS_INT:
      return ValidationErrorTypeEnum.IS_INT;
    case ClassValidatorErrorNameEnum.SHOULD_OR_NOT_EXISTS_BY_PROPERTY:
      return ValidationErrorTypeEnum.SHOULD_OR_NOT_EXISTS_BY_PROPERTY;
    default:
      console.log('Unknown error type: ' + errorType);
      return ValidationErrorTypeEnum.DEFAULT;
  }
}
