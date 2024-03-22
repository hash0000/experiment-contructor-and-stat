import { HttpStatus } from '@nestjs/common';
import { UpdateWriteOpResult } from 'mongoose';
import { CustomException } from '../exceptions/custom.exception';

function checkIsUpdated(updateResult: UpdateWriteOpResult): void {
  if (updateResult.matchedCount === 0) {
    throw new CustomException({
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

export default checkIsUpdated;
