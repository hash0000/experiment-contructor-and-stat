import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomResponseType, CustomResponseTypeError } from '../types/customResponseType';

export class ValidationException extends HttpException {
  messages;

  constructor(response: CustomResponseTypeError) {
    const responseBody: CustomResponseType = {
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      validationError: response,
    };
    super(responseBody, HttpStatus.UNPROCESSABLE_ENTITY);
    this.messages = responseBody;
  }
}
