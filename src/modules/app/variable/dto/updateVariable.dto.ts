import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDefined, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString, Length, Validate, ValidateNested } from 'class-validator';
import { IsGeneralValidationValidator } from 'src/common/validators/isGeneralValidation.validator';
import { IsNotBlank } from 'src/common/validators/isNotBlank.constraint';
import { IsUniqueArrayOfString } from 'src/common/validators/isUniqueArrayOfString.constraint';
import { IsExistsTitleOrContentInObject } from 'src/common/validators/variable/isExistsTitleOrContentInObject.constraint';
import { IsValidVariableArraysLength } from 'src/common/validators/variable/isValidVariableRowsLength.constraint';

class VariableUpdateColumnsDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  _id: string;

  @ApiPropertyOptional()
  @Validate(IsGeneralValidationValidator)
  @Length(1, 32)
  @IsNotBlank()
  @IsString()
  @IsDefined()
  @IsOptional()
  title: string;

  @ApiPropertyOptional()
  @Validate(IsGeneralValidationValidator)
  @Length(1, 1000, { each: true })
  @IsNotBlank(true, { each: true })
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  @IsOptional()
  content: string[];
}

class VariableUpdateValueDto {
  @ApiPropertyOptional()
  @Validate(IsGeneralValidationValidator)
  @Length(1, 32)
  @IsNotBlank()
  @IsString()
  @IsDefined()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @Validate(IsGeneralValidationValidator)
  @Length(1, 1000, { each: true })
  @IsNotBlank(true, { each: true })
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  @IsOptional()
  content?: string[];
}

export class UpdateVariableDto {
  @ApiPropertyOptional()
  @ApiProperty()
  @Validate(IsGeneralValidationValidator)
  @Length(1, 32)
  @IsNotBlank()
  @IsString()
  @IsDefined()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ type: VariableUpdateValueDto })
  @IsValidVariableArraysLength()
  @IsExistsTitleOrContentInObject({ each: true })
  @ValidateNested()
  @Type(() => VariableUpdateValueDto)
  @IsObject()
  @IsDefined()
  @IsOptional()
  value: VariableUpdateValueDto;

  @ApiPropertyOptional({ type: [VariableUpdateColumnsDto] })
  @IsUniqueArrayOfString('title')
  @IsExistsTitleOrContentInObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => VariableUpdateColumnsDto)
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  @IsOptional()
  columns: VariableUpdateColumnsDto[];
}
