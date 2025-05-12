import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

import { I_BaseResponseAuth } from '../interfaces/response.interface';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return this.validateRequest(request);
  }

  validateRequest(request: Request): boolean {
    try {
      const accessToken = request.cookies['accessToken'] as string;
      if (!accessToken) {
        return false;
      }
      const payload = this.jwtService.verify<I_BaseResponseAuth>(accessToken, {
        secret: process.env.JWT_ACCESS_TOKEN || 'jwt_access_token',
      });
      request['user'] = payload;
      return true;
    } catch {
      return false;
    }
  }
}
