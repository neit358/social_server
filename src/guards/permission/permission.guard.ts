import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Permission, RolePermissions } from './permission.enum';
import { PERMISSIONS_KEY } from './permission.decorator';
import { Request } from 'express';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'] as User;
    RolePermissions[user.role] = RolePermissions[user.role] || [];
    return requiredPermissions.every((permission) =>
      RolePermissions[user.role].includes(permission),
    );
  }
}
