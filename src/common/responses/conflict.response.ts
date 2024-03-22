import { ApiProperty } from '@nestjs/swagger';

export class ConflictResponse {
  @ApiProperty({ example: 409 })
  readonly statusCode: number;
}

export class ConflictWithErrorResponse extends ConflictResponse {
  @ApiProperty({ example: 1000 })
  readonly errorTypeCode: number;
}
