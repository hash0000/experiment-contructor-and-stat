import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDefined, IsObject, IsString, Length, Validate, ValidateNested } from 'class-validator';
import { IsGeneralValidationValidator } from 'src/common/validators/isGeneralValidation.validator';
import { IsNotBlank } from 'src/common/validators/isNotBlank.constraint';
import { IsUniqueArrayOfString } from 'src/common/validators/isUniqueArrayOfString.constraint';
import { IsValidVariableArraysLength } from '../../../../common/validators/variable/isValidVariableRowsLength.constraint';

class VariableColumnDto {
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

class VariableValueDto {
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

class CreateVariableFieldsDto {
  @ApiProperty()
  @Validate(IsGeneralValidationValidator)
  @Length(1, 32)
  @IsNotBlank()
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({ description: 'Variable value', type: VariableValueDto })
  @IsValidVariableArraysLength()
  @ValidateNested()
  @Type(() => VariableValueDto)
  @IsObject()
  @IsDefined()
  value: VariableValueDto;

  @ApiProperty({ description: 'Rows data', type: [VariableColumnDto] })
  @IsUniqueArrayOfString('title')
  @ValidateNested({ each: true })
  @Type(() => VariableColumnDto)
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  columns: VariableColumnDto[];
}

export class CreateVariableDto {
  @ApiProperty({ description: 'Variables', type: [CreateVariableFieldsDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateVariableFieldsDto)
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  variables: CreateVariableFieldsDto[];
}
