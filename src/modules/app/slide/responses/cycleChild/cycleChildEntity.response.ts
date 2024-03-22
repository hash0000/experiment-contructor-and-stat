import { ApiProperty } from '@nestjs/swagger';

export class CycleChildEntityResponse {
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
}
