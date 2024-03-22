import { ApiProperty } from '@nestjs/swagger';
import { CreatedResponse } from 'src/common/responses/created.response';

class CreateVariable201ResponseData {
  @ApiProperty({
    example: [
      {
        _id: 'eafc512c-7bee-4169-ba1c-de4d9408a4dd',
        name: 'N1 Variable',
      },
    ],
  })
  readonly variables: object[];
}

export class CreateVariable201Response extends CreatedResponse {
  @ApiProperty()
  readonly data: CreateVariable201ResponseData;
}
