import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponse {
  @ApiProperty({ example: 400 })
  readonly statusCode: number;
}

export class BadRequestWithErrorResponse extends BadRequestResponse {
  @ApiProperty({ example: 1011 })
  readonly errorTypeCode: number;
}
