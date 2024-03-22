import { JwtPayloadType } from './jwtPayload.type';

export type JwtPayloadWithTimeType = JwtPayloadType & {
  iat: number;
  exp: number;
};
