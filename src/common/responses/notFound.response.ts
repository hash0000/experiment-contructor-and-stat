import { ApiProperty } from '@nestjs/swagger';
import { CustomResponseTypeError } from '../types/customResponseType';

export class NotFoundResponse {
  @ApiProperty({ example: 404 })
  readonly statusCode: number;
}

export class NotFoundWithErrorResponse extends NotFoundResponse {
  @ApiProperty({ example: [{ property: 'property', validationErrorTypeCode: 100 }] })
  readonly validationError: CustomResponseTypeError;
}
