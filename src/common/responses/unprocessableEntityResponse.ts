import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CustomResponseTypeError } from '../types/customResponseType';

export class UnprocessableEntityResponse {
  @ApiProperty({ example: 422 })
  readonly statusCode: number;
}

export class UnprocessableEntityWithErrorResponse extends UnprocessableEntityResponse {
  @ApiPropertyOptional({
    example: [
      {
        property: 'property',
        validationErrorTypeCode: 112,
      },
    ],
  })
  readonly validationError?: CustomResponseTypeError;

  @ApiPropertyOptional({ example: 1000 })
  readonly errorTypeCode?: number;
}
