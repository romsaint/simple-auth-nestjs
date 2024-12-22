import { Body, Controller, Get, Inject, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { MyAuthGuard } from '../domain/auth/guards/myAuth.guard';
import { PermissionsAccess } from '../domain/auth/permissions/permissionsAccess';
import { RoleAccessGuard } from '../domain/auth/guards/role.guard';
import { Roles } from '../domain/auth/roles/roles';
import { RolesAccess } from '../domain/auth/roles/rolesAccess';
import { Permissions } from '../domain/auth/permissions/permissions';
import { PermissionsAccessGuard } from '../domain/auth/guards/permissions.guard';
import { InterfaceUserService } from 'src/domain/user/interfaces/userSerive.interface';
import { UserToJwt } from 'src/domain/user/dto/userToJwt.dto';


@Controller()
export class UserController {
  constructor(
    @Inject('UserService') private readonly userService: InterfaceUserService,
  ) {}


  @Get()
  @RolesAccess(Roles.ALL)
  @PermissionsAccess(Permissions.ALL)
  @UseGuards(MyAuthGuard, RoleAccessGuard, PermissionsAccessGuard)
  @Render('index')
  getUser(@Req() req) {
    const user = this.userService.getCurrentUser(req)
    return {name: user.username}
  }
}