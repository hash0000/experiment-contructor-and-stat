import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsDefined, IsMongoId } from 'class-validator';

export class DeleteVariableDto {
  @ApiProperty()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  variables: string[];
}
