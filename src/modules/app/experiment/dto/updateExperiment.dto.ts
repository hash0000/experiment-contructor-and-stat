import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';
import { trimTransformer } from 'src/common/transformers/trim.transformer';
import { IsValidExperimentConditionsOperator } from 'src/common/validators/experiment/isValidExperimentConditionsOperator.validator';
import { IsValidExperimentConditionsValue } from 'src/common/validators/experiment/isValidExperimentConditionsValue.validator';
import { v4 as uuidV4 } from 'uuid';
import { ValidationErrorTypeEnum } from '../../../../common/enums/errorType.enum';
import { CustomException } from '../../../../common/exceptions/custom.exception';
import { IsGeneralValidationValidator } from '../../../../common/validators/isGeneralValidation.validator';
import { IsNotBlank } from '../../../../common/validators/isNotBlank.constraint';
import { accessConditionsConditionEnum, accessConditionsOperatorEnum, answerTypeEnum } from '../../database/entities/postgres/experiment.entity';

export class UpdateExperimentAccessConditionsDto {
  @IsMongoId()
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @IsOptional()
  readonly id = String(new mongoose.Types.ObjectId());

  @ApiProperty()
  @IsValidExperimentConditionsValue()
  @IsNotBlank()
  @IsString()
  @IsDefined()
  readonly value: string;

  @ApiProperty({ enum: accessConditionsConditionEnum })
  @IsEnum(accessConditionsConditionEnum)
  @IsDefined()
  readonly condition: accessConditionsConditionEnum;

  @ApiProperty({ enum: accessConditionsOperatorEnum })
  @IsValidExperimentConditionsOperator()
  @IsEnum(accessConditionsOperatorEnum)
  @IsDefined()
  readonly operator: accessConditionsOperatorEnum;
}

class transitionOnButtonPressDto {
  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly keyboard?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly mouse?: boolean;

  @ApiProperty()
  @IsNotBlank()
  @IsString()
  @IsDefined()
  readonly keyShortcut?: string;
}

export class UpdateExperimentRequestedQuestionsDto {
  @IsUUID(4)
  @IsString()
  @IsOptional()
  readonly id: string = uuidV4();

  @ApiProperty()
  @Transform(({ value }) => trimTransformer(value, 'question'))
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  readonly question: string;

  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly isRequired: boolean;

  @ApiProperty({ enum: answerTypeEnum })
  @IsEnum(answerTypeEnum)
  @IsDefined()
  readonly answerType: answerTypeEnum;

  @ApiProperty()
  @IsNotBlank(true, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  @ValidateIf((object, value) => {
    if (object.answerType !== answerTypeEnum.TEXT) {
      return true;
    } else if (object.answerType === answerTypeEnum.TEXT && value === null) {
      return false;
    } else {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validationError: [{ property: 'requestedQuestions.answers', validationErrorTypeCode: ValidationErrorTypeEnum.IS_NULL }],
      });
    }
  })
  readonly answers: string[] | null;
}

class UpdateExperimentSaveSettingsDto {
  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly timeOnEachSlide: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly totalTime: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly startTime: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly endTime: boolean;
}

export class UpdateExperimentRequestedParametersRespondentDataDto {
  @IsMongoId()
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @IsOptional()
  readonly id = String(new mongoose.Types.ObjectId());

  @ApiProperty()
  @Validate(IsGeneralValidationValidator)
  @IsNotBlank()
  @IsString()
  @IsDefined()
  readonly title: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  readonly variableId: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  readonly attributeId: string;
}

class ExperimentSettingsBasicRespondentDataDto {
  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly firstName: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly lastName: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly birthday: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly sex: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly email: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly phone: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly nativeLanguages: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly learnedLanguages: boolean;
}

export class UpdateExperimentDto {
  @ApiPropertyOptional()
  @Validate(IsGeneralValidationValidator)
  @Transform(({ value }) => trimTransformer(value, 'title'))
  @Length(1, 256)
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly title?: string;

  @ApiPropertyOptional()
  @Validate(IsGeneralValidationValidator)
  @Transform(({ value }) => trimTransformer(value, 'description'))
  @Length(1, 1000)
  @IsNotEmpty()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  @IsOptional()
  readonly description?: string | null;

  @ApiPropertyOptional({ type: UpdateExperimentSaveSettingsDto })
  @ValidateNested()
  @Type(() => UpdateExperimentSaveSettingsDto)
  @IsDefined()
  @IsOptional()
  readonly saveSettings?: UpdateExperimentSaveSettingsDto;

  @ApiPropertyOptional({
    type: ExperimentSettingsBasicRespondentDataDto,
  })
  @ValidateNested({ each: true })
  @Type(() => ExperimentSettingsBasicRespondentDataDto)
  @IsDefined()
  @IsOptional()
  readonly requestedBasicRespondentData?: ExperimentSettingsBasicRespondentDataDto;

  @ApiPropertyOptional({
    type: transitionOnButtonPressDto,
  })
  @ValidateNested()
  @Type(() => transitionOnButtonPressDto)
  @IsDefined()
  @IsOptional()
  readonly transitionShortcutSettings?: transitionOnButtonPressDto;

  @ApiPropertyOptional({
    type: [UpdateExperimentRequestedParametersRespondentDataDto],
  })
  @ValidateNested()
  @Type(() => UpdateExperimentRequestedParametersRespondentDataDto)
  @IsArray()
  @IsDefined()
  @IsOptional()
  readonly requestedParametersRespondentData?: UpdateExperimentRequestedParametersRespondentDataDto[];

  @ApiPropertyOptional({
    type: [UpdateExperimentAccessConditionsDto],
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateExperimentAccessConditionsDto)
  @IsArray()
  @IsDefined()
  @IsOptional()
  readonly accessConditions?: UpdateExperimentAccessConditionsDto[];

  @ApiPropertyOptional({
    type: [UpdateExperimentRequestedQuestionsDto],
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateExperimentRequestedQuestionsDto)
  @IsArray()
  @IsDefined()
  @IsOptional()
  readonly requestedQuestions?: UpdateExperimentRequestedQuestionsDto[];

  @ApiPropertyOptional()
  @Validate(IsGeneralValidationValidator)
  @Transform(({ value }) => trimTransformer(value, 'creators'))
  @Length(1, 255)
  @IsNotEmpty()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  @IsOptional()
  readonly creators?: string | null;
}
