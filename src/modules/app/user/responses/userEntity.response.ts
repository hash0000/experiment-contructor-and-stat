import { ApiProperty } from '@nestjs/swagger';

class UserEntityResponse {
  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly middleName: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly phone: string;

  @ApiProperty()
  readonly birthday: Date;

  @ApiProperty()
  readonly laboratory: string;

  @ApiProperty()
  readonly specialization: string;

  @ApiProperty()
  readonly sex: number;

  @ApiProperty()
  readonly avatarUrl: string;
}

export default UserEntityResponse;
