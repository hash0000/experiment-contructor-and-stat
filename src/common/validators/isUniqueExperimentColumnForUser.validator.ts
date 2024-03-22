import { HttpStatus } from '@nestjs/common';
import { ExperimentEntityP } from 'src/modules/app/database/entities/postgres/experiment.entity';
import { UserEntityP } from 'src/modules/app/database/entities/postgres/user.entity';
import { PostgresDataSource } from '../configs/typeorm.config';
import { ValidationErrorTypeEnum } from '../enums/errorType.enum';
import { CustomException } from '../exceptions/custom.exception';

export async function isUniqueExperimentColumnForUserValidator(
  value: string,
  column: string,
  userId: UserEntityP['id'],
  id?: string,
  isUpdate?: boolean,
): Promise<void> {
  const queryRunner = PostgresDataSource.createQueryRunner();
  try {
    await queryRunner.connect();

    const experimentEntity = await queryRunner.manager
      .getRepository(ExperimentEntityP)
      .createQueryBuilder('experiment')
      .leftJoinAndMapOne('experiment.userId', UserEntityP, 'user', 'user.id = experiment."userId"')
      .where('user.id = :userId', { userId: userId })
      .andWhere(`${column} = :value`, { value: value })
      .select(['experiment.id', 'experiment.title', 'experiment.id', 'user.id'])
      .getOne();

    if (!experimentEntity) {
      return;
    }

    if (!!isUpdate && !!id && experimentEntity['id'] == id && experimentEntity['userId'].id == userId && experimentEntity[`${column}`] == value) {
      return;
    }

    if (!!experimentEntity) {
      throw ValidationErrorTypeEnum.IS_UNIQUE;
    }
  } catch (e) {
    if (e === ValidationErrorTypeEnum.IS_UNIQUE) {
      throw new CustomException({
        statusCode: HttpStatus.CONFLICT,
        validationError: [{ property: column, validationErrorTypeCode: ValidationErrorTypeEnum.IS_UNIQUE }],
      });
    } else {
      console.log(e);
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  } finally {
    await queryRunner.release();
  }
}
