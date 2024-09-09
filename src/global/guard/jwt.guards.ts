import { AuthGuard } from '@nestjs/passport';

// 用户各个模块是否通过jwt验证
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
