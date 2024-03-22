import { ApiProperty } from '@nestjs/swagger';

export class NoContentResponse {
  @ApiProperty({ example: 204 })
  readonly statusCode: number;
}
