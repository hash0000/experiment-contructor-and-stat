import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class GetByIdDto {
  @ApiProperty()
  @IsIn(['0', '1'])
  @IsString()
  @IsOptional()
  readonly isShouldSlides: '0' | '1' = '1';
}
