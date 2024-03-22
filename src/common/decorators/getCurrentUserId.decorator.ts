import { createParamDecorator, ExecutionContext, HttpStatus } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { ValidationErrorTypeEnum } from '../enums/errorType.enum';
import { CustomException } from '../exceptions/custom.exception';
import { JwtPayloadType } from '../types/jwtPayload.type';

export const GetCurrentUserIdDecorator = createParamDecorator((_: undefined, context: ExecutionContext): string => {
  const request = context.switchToHttp().getRequest();
  const user = request.user as JwtPayloadType;

  if (isUUID(user.id, 4)) {
    return user.id;
  }

  throw new CustomException({
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    validationError: [{ property: 'id', validationErrorTypeCode: ValidationErrorTypeEnum.IS_UUID }],
  });
});
