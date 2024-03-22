import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsHexColor, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAllSlidesColor {
  @ApiPropertyOptional({ description: 'Color' })
  @IsHexColor()
  @IsNotEmpty()
  @IsString()
  colorCode?: string;
}
