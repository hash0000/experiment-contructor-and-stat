import { ApiProperty } from '@nestjs/swagger';

class VariableResponseValue {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string[];
}

class VariableResponseColumns extends VariableResponseValue {
  @ApiProperty()
  _id: string;
}

export class VariableResponse {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  value: VariableResponseValue;

  @ApiProperty({ type: [VariableResponseColumns] })
  columns: VariableResponseColumns[];
}
