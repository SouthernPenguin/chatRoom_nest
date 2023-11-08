import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ListInterceptorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const t = context.switchToHttp().getRequest().query;
    if (typeof t == 'object') {
      t.fromUserId = Number(t.fromUserId);
      t.toUserId = Number(t.toUserId);
    }

    return next.handle();
  }
}
