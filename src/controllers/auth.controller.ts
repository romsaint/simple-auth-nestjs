import { Body, Controller, Get, Inject, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../domain/auth/auth.service';
import { MyAuthGuard } from '../domain/auth/guards/myAuth.guard';
import { PermissionsAccess } from '../domain/auth/permissions/permissionsAccess';
import { RoleAccessGuard } from '../domain/auth/guards/role.guard';
import { Roles } from '../domain/auth/roles/roles';
import { RolesAccess } from '../domain/auth/roles/rolesAccess';
import { Permissions } from '../domain/auth/permissions/permissions';
import { User } from '../domain/user/entities/user.entity';
import { PermissionsAccessGuard } from '../domain/auth/guards/permissions.guard';
import { InterfaceAuthService } from 'src/domain/auth/interfaces/authService.interface';
import { UserLoginDto } from 'src/domain/user/dto/userLogin.dto';
import { UserToJwt } from 'src/domain/user/dto/userToJwt.dto';

@Controller()
export class AuthController {
  constructor(
    @Inject('AuthService') private readonly authService: InterfaceAuthService,
  ) {}

  @Post('login')
  async login(@Body() user: UserLoginDto, @Res({passthrough: true}) res: Response): Promise<{ user: UserToJwt }> {
    return this.authService.login(user, res)
  }
                     
  @Get()
  @RolesAccess(Roles.ALL)
  @PermissionsAccess(Permissions.ALL)                            
  @UseGuards(MyAuthGuard, RoleAccessGuard, PermissionsAccessGuard)
  @Render('index')
  getUser(@Req() req) {
    return {name: req.user.email}
  }
}
