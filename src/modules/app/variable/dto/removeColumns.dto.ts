import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsDefined, IsMongoId } from 'class-validator';

export class RemoveColumnsDto {
  @ApiProperty()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  ids: number[];
}
