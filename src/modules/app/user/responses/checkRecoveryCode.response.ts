import { ApiProperty } from '@nestjs/swagger';
import { NotFoundResponse } from 'src/common/responses/notFound.response';

export class CheckRecoveryCode404Response extends NotFoundResponse {
  @ApiProperty({ example: 1011 })
  readonly errorTypeCode: number;
}
