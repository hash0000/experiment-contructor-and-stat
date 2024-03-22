import { ApiProperty } from '@nestjs/swagger';
import { CustomErrorTypeEnum } from '../../../../common/enums/errorType.enum';
import { TooManyRequestsResponse } from '../../../../common/responses/tooManyRequests.response';

export class SendUserCode429Response extends TooManyRequestsResponse {
  @ApiProperty({ example: { timeLeft: 3000 } })
  readonly data: number;

  @ApiProperty({ example: CustomErrorTypeEnum.TOO_MANY_REQUESTS })
  readonly errorType: number;
}
