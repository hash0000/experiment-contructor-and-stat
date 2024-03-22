import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsDefined, Validate } from 'class-validator';
import { IsValidRowElementValidator } from 'src/common/validators/isValidRowElement.validator';
import { RowEntity } from 'src/modules/app/database/entities/postgres/row.entity';
import { TextFieldElement } from '../../database/entities/elements/textFieldElement';
import { ButtonElement } from '../../database/entities/elements/buttonElement';
import { SliderElement } from '../../database/entities/elements/sliderElement';

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
  elements: RowEntity['elements'];
}
