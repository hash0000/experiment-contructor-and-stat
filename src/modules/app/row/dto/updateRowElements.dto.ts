import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsDefined, Validate } from 'class-validator';
import { IsValidRowElementValidator } from 'src/common/validators/isValidRowElement.validator';
import { ButtonElement } from 'src/modules/app/database/entities/buttonElement';
import { RowEntity } from 'src/modules/app/database/entities/postgres/row.entity';
import { SliderElement } from 'src/modules/app/database/entities/sliderElement';
import { TextFieldElement } from 'src/modules/app/database/entities/textFieldElement';
import { TextInputElement } from '../../database/entities/textInputElement';

export class UpdateRowElementsDto {
  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [{ example: new TextFieldElement() }, { example: new ButtonElement() }, { example: new SliderElement() }, { example: new TextInputElement() }],
    },
  })
  @Validate(IsValidRowElementValidator)
  @ArrayMaxSize(3)
  @IsArray()
  @IsDefined()
  elements: RowEntity['elements'];
}
