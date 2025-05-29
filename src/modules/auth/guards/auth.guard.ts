import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

import { I_BaseResponseAuth } from '../interfaces/response.interface';
import { Request } from 'express';
// import { Socket } from 'dgram';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // const client: Socket = context.switchToWs().getClient<Socket>();
    // interface IHandshakeHeaders {
    //   [key: string]: string | undefined;
    // }

    // interface IClientWithHandshake {
    //   handshake: {
    //     headers: IHandshakeHeaders;
    //   };
    // }

    // const clientWithHandshake = client as unknown as IClientWithHandshake;
    // const accessToken: string | undefined = clientWithHandshake.handshake.headers['cookie']
    //   ?.split('; ')
    //   .find((c: string) => c.startsWith('accessToken='))
    //   ?.split('=')[1];
    // console.log('accessToken', accessToken);
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
