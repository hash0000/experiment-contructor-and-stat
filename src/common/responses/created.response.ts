import { ApiProperty } from '@nestjs/swagger';

export class CreatedResponse {
  @ApiProperty({ example: 201 })
  readonly statusCode: string;
}
