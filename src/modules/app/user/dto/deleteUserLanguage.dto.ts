import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteUserLanguageDto {
  @ApiProperty({
    description: 'Array of user language ids',
    type: ['string'],
  })
  @IsUUID(4, { each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  userLanguages: string[];
}
