import { ApiProperty } from '@nestjs/swagger';
import { transitionTypeEnum } from '../../database/entities/postgres/slide.entity';

export class CycleEntityResponse {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly training: boolean;

  @ApiProperty()
  readonly autoTransition: boolean;

  @ApiProperty()
  readonly timeForTransition: number;

  @ApiProperty()
  readonly colorCode: string;

  @ApiProperty()
  readonly position: number;

  @ApiProperty()
  readonly transitionType: transitionTypeEnum;

  @ApiProperty()
  readonly isCycle: boolean;
}
