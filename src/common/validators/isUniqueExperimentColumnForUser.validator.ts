import { HttpStatus } from '@nestjs/common';
import { ExperimentEntity } from 'src/modules/app/database/entities/postgres/experiment.entity';
import { UserEntity } from 'src/modules/app/database/entities/postgres/user.entity';
import { PostgresDataSource } from '../configs/typeorm.config';
import { ValidationErrorTypeEnum } from '../enums/errorType.enum';
import { CustomException } from '../exceptions/custom.exception';

export async function isUniqueExperimentColumnForUserValidator(
  value: string,
  column: string,
  userId: UserEntity['id'],
  id?: string,
  isUpdate?: boolean,
): Promise<void> {
  const queryRunner = PostgresDataSource.createQueryRunner();
  try {
    await queryRunner.connect();

    const experimentEntity = await queryRunner.manager
      .getRepository(ExperimentEntity)
      .createQueryBuilder('experiment')
      .leftJoinAndMapOne('experiment.userId', UserEntity, 'user', 'user.id = experiment."userId"')
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
