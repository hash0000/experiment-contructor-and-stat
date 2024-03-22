import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Length, Validate } from 'class-validator';
import { FeedbackSubjectEnum } from '../../../../common/enums/feedbackSubject.enum';
import { trimTransformer } from '../../../../common/transformers/trim.transformer';
import { IsGeneralValidationValidator } from '../../../../common/validators/isGeneralValidation.validator';
import { IsUserName } from '../../../../common/validators/isUserName.validator';

export class SendFeedbackDto {
  @ApiProperty({ description: 'Email' })
  @Transform(({ value }) => trimTransformer(value, 'email'))
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty({ description: 'First name' })
  @Validate(IsUserName)
  @Length(1, 255)
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty({ description: 'Last name' })
  @Validate(IsUserName)
  @Length(1, 255)
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty({ description: 'Text body' })
  @Validate(IsGeneralValidationValidator)
  @Transform(({ value }) => trimTransformer(value, 'email'))
  @Length(1, 1024)
  @IsNotEmpty()
  @IsString()
  readonly textBody: string;

  @ApiProperty({ description: 'Mail subject', examples: [FeedbackSubjectEnum.BUSINESS, FeedbackSubjectEnum.TECHNICAL] })
  @IsEnum(FeedbackSubjectEnum)
  @IsNumber()
  @IsDefined()
  readonly subject: FeedbackSubjectEnum;
}
