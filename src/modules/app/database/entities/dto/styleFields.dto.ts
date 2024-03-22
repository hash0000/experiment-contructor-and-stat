import { IsDefined, IsHexColor, IsNotEmpty, IsNumber, IsString, Length, Max, Min, ValidateIf } from 'class-validator';

export class StyleFieldsDto {
  @IsHexColor()
  @IsString()
  @IsNotEmpty()
  readonly mainColor: string;

  @IsHexColor()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  readonly secondColor: string;

  @IsHexColor()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  readonly thirdColor: string;

  @Min(1)
  @Max(50)
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  @IsDefined()
  readonly fontSize: number;

  @Min(1)
  @Max(3)
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  @IsDefined()
  readonly position: number;
}
