import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, finalize, map, Observable, tap } from 'rxjs';

@Injectable()
export class CommonInterceptor implements NestInterceptor {
  intercept<T>(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        console.log('Total time:', Date.now() - now, 'ms');
      }),
      map((data: T) => {
        console.log('Response data:', data);
        return data;
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        throw error;
      }),
      finalize(() => {
        console.log('Request finalized');
      }),
    );
  }
}
