import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDefined, IsEnum, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { UserLanguageProficiencyEnum } from '../../database/entities/postgres/userLanguage.entity';

class UpdateUserLanguageBody {
  @ApiProperty({
    description: 'User language id',
  })
  @IsUUID(4)
  @IsNotEmpty()
  @IsString()
  userLanguageId: string;

  @ApiProperty({
    description: 'Language proficiency',
    examples: [
      UserLanguageProficiencyEnum.ELEMENTARY,
      UserLanguageProficiencyEnum.PRE_INTERMEDIATE,
      UserLanguageProficiencyEnum.INTERMEDIATE,
      UserLanguageProficiencyEnum.UPPER_INTERMEDIATE,
      UserLanguageProficiencyEnum.ADVANCED,
      UserLanguageProficiencyEnum.PROFICIENT,
      UserLanguageProficiencyEnum.NATIVE,
    ],
  })
  @IsEnum(UserLanguageProficiencyEnum)
  @IsNotEmpty()
  @IsString()
  proficiency: UserLanguageProficiencyEnum;
}

export class UpdateUserLanguageDto {
  @ApiProperty({
    description: 'Array of user languages',
    type: [UpdateUserLanguageBody],
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateUserLanguageBody)
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  userLanguages: UpdateUserLanguageBody[];
}
