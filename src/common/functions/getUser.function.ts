import { HttpStatus } from '@nestjs/common';
import { UserEntityP } from 'src/modules/app/database/entities/postgres/user.entity';
import { PostgresDataSource } from '../configs/typeorm.config';
import { CustomException } from '../exceptions/custom.exception';

async function getUser(whereData: string, property = 'id', select?: object): Promise<UserEntityP> {
  const queryRunner = PostgresDataSource.createQueryRunner();
  try {
    await queryRunner.connect();

    let selectOption: object = {
      firstName: true,
      lastName: true,
      middleName: true,
      email: true,
      phone: true,
      phoneCountryCode: true,
      birthday: true,
      laboratory: true,
      specialization: true,
      sex: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
    };

    if (select) {
      selectOption = select;
    }

    const userEntity = await queryRunner.manager.getRepository(UserEntityP).findOne({
      where: { [`${property}`]: whereData },
      select: selectOption,
    });

    return userEntity;
  } catch (e) {
    console.log(e);
    throw new CustomException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  } finally {
    await queryRunner.release();
  }
}

export default getUser;
