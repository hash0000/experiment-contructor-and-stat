import { HttpStatus } from '@nestjs/common';
import { PostgresDataSource } from '../configs/typeorm.config';
import { CustomErrorTypeEnum } from '../enums/errorType.enum';
import { CustomException } from '../exceptions/custom.exception';

async function checkIsExists(tableName: string, id: string, returnBoolean?: boolean): Promise<boolean> {
  const queryRunner = PostgresDataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    const entityCount = await queryRunner.manager.query(
      `SELECT COUNT(*)
       FROM "${tableName}"
       WHERE id = $1`,
      [id],
    );

    if (entityCount === 0) {
      if (!returnBoolean) {
        throw HttpStatus.NOT_FOUND;
      } else {
        return false;
      }
    }
    return true;
  } catch (e) {
    if (e === HttpStatus.NOT_FOUND) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    }
    console.log(e);
    throw new CustomException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  } finally {
    await queryRunner.release();
  }
}

export default checkIsExists;
