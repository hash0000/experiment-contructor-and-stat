import { ApiProperty } from '@nestjs/swagger';

export class TooManyRequestsResponse {
  @ApiProperty({ example: 429 })
  readonly statusCode: number;
}
