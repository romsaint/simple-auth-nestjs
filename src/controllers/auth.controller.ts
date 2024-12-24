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
import { UserRegistrationDto } from 'src/domain/user/dto/userToRegistration.dto';

@Controller()
export class AuthController {
  constructor(
    @Inject('AuthService') private readonly authService: InterfaceAuthService,
  ) {}

  @Post('login')
  async login(@Body() user: UserLoginDto, @Res({passthrough: true}) res: Response): Promise<UserToJwt> {
    return this.authService.login(user, res)
  }
   
  @Post('registration')
  async registration(@Body() user: UserRegistrationDto, @Res({passthrough: true}) res: Response) {
    return this.authService.registration(user, res)
  }
}