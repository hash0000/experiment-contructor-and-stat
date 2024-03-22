import { HttpException } from '@nestjs/common';
import { CustomResponseType } from '../types/customResponseType';

export class CustomException extends HttpException {
  constructor(response: CustomResponseType) {
    super(response, response.statusCode);

    HttpException.createBody(response);
  }
}
