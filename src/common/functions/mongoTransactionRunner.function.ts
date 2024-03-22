import { ClientSession, Connection } from 'mongoose';
import { CustomException } from '../exceptions/custom.exception';
import { HttpStatus } from '@nestjs/common';

export const MongoTransactionRunner = async <T>(connection: Connection, cb: (session: ClientSession) => Promise<T>): Promise<T> => {
  const session = await connection.startSession();

  try {
    session.startTransaction();
    const result = await cb(session);
    await session.commitTransaction();
    return result;
  } catch (e) {
    await session.abortTransaction();
    console.error(e);
    console.error('Error while DB transaction');
    throw new CustomException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  } finally {
    await session.endSession();
  }
};
