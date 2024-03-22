import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString, IsUUID } from 'class-validator';
import { IsDateFromNumber } from '../../../../common/validators/isDateFromNumber.validator';

export class FinishExperimentDto {
  @ApiProperty()
  @IsUUID()
  @IsString()
  @IsDefined()
  previousSlideId: string;

  @ApiProperty()
  @IsDateFromNumber()
  @IsNumber()
  @IsDefined()
  jsFinishTimestamp: number;
}
