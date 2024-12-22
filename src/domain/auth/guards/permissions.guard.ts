import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from 'src/domain/auth/permissions/permissions';
import { MyRequest } from 'src/shared/myRequest';

@Injectable()
export class PermissionsAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());

      if (!requiredPermissions || requiredPermissions[0] === Permissions.ALL) {
        return true
      }

      const request: MyRequest = context.switchToHttp().getRequest();
      const userPermissions: string[] = request.user.permissions;
      console.log(request.user)

      return userPermissions.filter((val) => requiredPermissions.includes(val)).length > 0
    } catch (e) {
      throw new UnauthorizedException()
    }
  }
}