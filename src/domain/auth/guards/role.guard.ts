import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/domain/auth/roles/roles';
import { MyRequest } from 'src/shared/myRequest';

@Injectable()
export class RoleAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!requiredRoles || requiredRoles[0] === Roles.ALL) {
        return true
      }

      const request: MyRequest = context.switchToHttp().getRequest();
      const userRoles: string = request.user.roles;

      return requiredRoles.includes(userRoles)
    } catch (e) {
      throw new UnauthorizedException()
    }
  }
}