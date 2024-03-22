import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenResponse {
  @ApiProperty({ example: 403 })
  readonly statusCode: number;
}

export class ForbiddenWithErrorResponse extends ForbiddenResponse {
  @ApiProperty({ example: 1000 })
  readonly errorTypeCode: number;
}
