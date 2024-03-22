import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDefined, IsString, Length, Validate, ValidateNested } from 'class-validator';
import { IsGeneralValidationValidator } from 'src/common/validators/isGeneralValidation.validator';
import { IsNotBlank } from 'src/common/validators/isNotBlank.constraint';
import { IsUniqueArrayOfString } from 'src/common/validators/isUniqueArrayOfString.constraint';

class AddColumnsColumnsDto {
  @ApiProperty()
  @Validate(IsGeneralValidationValidator)
  @Length(1, 32)
  @IsNotBlank()
  @IsString()
  @IsDefined()
  title: string;

  @ApiProperty()
  @Validate(IsGeneralValidationValidator)
  @Length(1, 1000, { each: true })
  @IsNotBlank(true, { each: true })
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  content: string[];
}

export class AddColumnsDto {
  @ApiProperty({ type: [AddColumnsColumnsDto] })
  @IsUniqueArrayOfString('title')
  @ValidateNested({ each: true })
  @Type(() => AddColumnsColumnsDto)
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  columns: AddColumnsColumnsDto[];
}
