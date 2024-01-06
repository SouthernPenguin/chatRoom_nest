import { UnauthorizedException } from '@nestjs/common';

type token = { username: string; id: number };
export const getTokenUser = async (req: Request): Promise<token> => {
  if ('user' in req) {
    return req['user'] as token;
  }
  throw new UnauthorizedException('token 过期');
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)) as any);

  return Math.round(100 * (bytes / Math.pow(k, i))) / 100 + ' ' + sizes[i];
};
