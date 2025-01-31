import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ExperimentPlatformEnum } from 'src/modules/app/database/entities/postgres/experiment.entity';
import { IsSameOrAfterNow } from '../../../../common/validators/user/IsSameOrAfterNow.constraint';
import { UserSexEnum } from '../../database/entities/postgres/user.entity';
import { IsDateFromNumber } from '../../../../common/validators/isDateFromNumber.validator';

class RequestedParametersRespondentDataDto {
  @ApiProperty()
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly value: string;
}

class RequestedQuestionsDto {
  @ApiProperty()
  @IsUUID(4)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly id: string;

  @ApiProperty()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @IsArray()
  @IsDefined({ each: true })
  readonly answers: string[];
}

export class StartExperimentDto {
  @ApiPropertyOptional()
  @IsMongoId()
  @IsDefined()
  @IsOptional()
  readonly sessionId?: string;

  @ApiProperty({ enum: ExperimentPlatformEnum })
  @IsEnum(ExperimentPlatformEnum)
  @IsDefined()
  readonly platform: ExperimentPlatformEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @ValidateIf((_, value) => value !== null)
  readonly firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @ValidateIf((_, value) => value !== null)
  readonly lastName: string;

  @ApiProperty()
  @IsSameOrAfterNow()
  @IsDateString()
  @IsDefined()
  @ValidateIf((_, value) => value !== null)
  readonly birthday: Date;

  @ApiProperty({ enum: UserSexEnum })
  @IsEnum(UserSexEnum)
  @IsDefined()
  @ValidateIf((_, value) => value !== null)
  readonly sex: UserSexEnum;

  @ApiProperty()
  @IsEmail()
  @IsDefined()
  @ValidateIf((_, value) => value !== null)
  readonly email: string;

  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty()
  @IsDefined()
  @ValidateIf((_, value) => value !== null)
  readonly phone: string;

  @ApiProperty()
  @IsDateFromNumber()
  @IsNumber()
  @IsOptional()
  readonly jsStartTimestamp?: number;

  @ApiProperty()
  @IsUUID(4, { each: true })
  @IsArray()
  @IsDefined()
  @ValidateIf((_, value) => {
    if (Array.isArray(value) || value !== null) {
      return true;
    }
  })
  readonly nativeLanguages: string[];

  @ApiProperty()
  @IsUUID(4, { each: true })
  @IsArray()
  @IsDefined()
  @ValidateIf((_, value) => {
    if (Array.isArray(value) || value !== null) {
      return true;
    }
  })
  readonly learnedLanguages: string[];

  @ApiProperty({ type: [RequestedParametersRespondentDataDto] })
  @Type(() => RequestedParametersRespondentDataDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  @ValidateIf((_, value) => value !== null)
  readonly requestedParametersRespondentData: RequestedParametersRespondentDataDto[];

  @ApiProperty({ type: [RequestedQuestionsDto] })
  @Type(() => RequestedQuestionsDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  @ValidateIf((_, value) => value !== null)
  readonly requestedQuestions: RequestedQuestionsDto[];
}
