import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsDefined, Validate } from 'class-validator';
import { IsValidRowElementValidator } from 'src/common/validators/isValidRowElement.validator';
import { ButtonElement } from 'src/modules/app/database/entities/elements/buttonElement';
import { RowEntityP } from 'src/modules/app/database/entities/postgres/row.entity';
import { SliderElement } from 'src/modules/app/database/entities/elements/sliderElement';
import { TextFieldElement } from 'src/modules/app/database/entities/elements/textFieldElement';

export class UpdateRowElementsDto {
  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [{ example: new TextFieldElement() }, { example: new ButtonElement() }, { example: new SliderElement() }],
    },
  })
  @Validate(IsValidRowElementValidator)
  @ArrayMaxSize(3)
  @IsArray()
  @IsDefined()
  elements: RowEntityP['elements'];
}
