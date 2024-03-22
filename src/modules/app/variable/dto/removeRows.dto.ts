import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsDefined, IsInt } from 'class-validator';

export class RemoveRowsDto {
  @ApiProperty()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  indexes: number[];
}
