import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ListInterceptorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const t = context.switchToHttp().getRequest().query;
    if (typeof t == 'object') {
      t.fromUserId = Number(t.fromUserId);
      t.toUserId = Number(t.toUserId);
      if (t.createdTime && t.createdTime.length > 0) {
        if (t.createdTime[0] == '' || t.createdTime[1] == '') {
          t.createdTime = [];
        }
      }

      if (t.createdTime == '') {
        t.createdTime = [];
      }
    }

    return next.handle();
  }
}
