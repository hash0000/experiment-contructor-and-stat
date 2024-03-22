import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadWithTimeType } from '../types/jwtPayloadWithTime.type';

export const GetCurrentUserPayloadDecorator = createParamDecorator((_: undefined, context: ExecutionContext): JwtPayloadWithTimeType => {
  const request = context.switchToHttp().getRequest();
  return request.user as JwtPayloadWithTimeType;
});
