import { UnauthorizedException } from '@nestjs/common';

type token = { username: string; id: number };
export const getTokenUser = async (req: Request): Promise<token> => {
  if ('user' in req) {
    return req['user'] as token;
  }
  throw new UnauthorizedException('token 过期');
};
