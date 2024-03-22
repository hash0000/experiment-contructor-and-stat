import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { transitionTypeEnum } from '../../database/entities/postgres/slide.entity';
import { UpdateCycleChildDto } from './cycle/updateCycleChild.dto';

export class UpdateSlideDto extends UpdateCycleChildDto {
  @ApiPropertyOptional()
  @IsMongoId()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly variableId?: string;

  @ApiPropertyOptional({
    enum: transitionTypeEnum,
  })
  @IsEnum(transitionTypeEnum)
  @IsNumber()
  @IsOptional()
  readonly transitionType?: transitionTypeEnum;
}
