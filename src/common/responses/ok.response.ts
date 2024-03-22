import { ApiProperty } from '@nestjs/swagger';

export class OkResponse {
  @ApiProperty({ example: 200 })
  readonly statusCode: number;
}
