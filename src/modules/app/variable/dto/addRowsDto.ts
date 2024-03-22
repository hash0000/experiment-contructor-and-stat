import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDefined, IsMongoId, IsNotEmpty, IsString, Length, Validate, ValidateNested } from 'class-validator';
import { IsGeneralValidationValidator } from 'src/common/validators/isGeneralValidation.validator';
import { IsNotBlank } from 'src/common/validators/isNotBlank.constraint';
import { IsValidVariableArraysLength } from 'src/common/validators/variable/isValidVariableRowsLength.constraint';

class AddRowsColumnsDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  _id: string;

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

export class AddRowsDto {
  @ApiProperty()
  @IsValidVariableArraysLength(true)
  @Validate(IsGeneralValidationValidator)
  @Length(1, 1000, { each: true })
  @IsNotBlank(true, { each: true })
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  value: string[];

  @ApiProperty({ type: [AddRowsColumnsDto] })
  @ValidateNested({ each: true })
  @Type(() => AddRowsColumnsDto)
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  columns: AddRowsColumnsDto[];
}
