import { HttpStatus } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { CustomException } from '../exceptions/custom.exception';

function checkIsUpdated(entity: UpdateResult): void {
  try {
    if (entity.affected === 0) {
      throw HttpStatus.BAD_REQUEST;
    }
  } catch (e) {
    if (e === HttpStatus.BAD_REQUEST) {
      throw new CustomException({
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    console.log(e);
    throw new CustomException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export default checkIsUpdated;
