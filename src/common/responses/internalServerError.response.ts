import { ApiProperty } from '@nestjs/swagger';

export class InternalServerErrorResponse {
  @ApiProperty({ example: 500 })
  readonly statusCode: string;
}
