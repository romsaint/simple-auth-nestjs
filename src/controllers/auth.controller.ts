import { Body, Controller, Get, Inject, Post, Render, Req, Res, UseGuards, Version } from '@nestjs/common';
import { Response } from 'express';
import { InterfaceAuthService } from 'src/domain/auth/interfaces/authService.interface';
import { UserLoginDto } from 'src/domain/user/dto/userLogin.dto';
import { UserToJwt } from 'src/domain/user/dto/userToJwt.dto';
import { UserRegistrationDto } from 'src/domain/user/dto/userToRegistration.dto';
import { UserResetPasswordDto } from 'src/domain/user/dto/userResetPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthService') private readonly authService: InterfaceAuthService,
  ) {}

  @Post('login')
  @Version('1')
  async login(@Body() user: UserLoginDto, @Res({passthrough: true}) res: Response): Promise<UserToJwt> {
    return this.authService.login(user, res)
  }
   
  @Post('registration')
  @Version('1')
  async registration(@Body() user: UserRegistrationDto, @Res({passthrough: true}) res: Response) {
    return this.authService.registration(user, res)
  }
  
  @Post('reset_password')
  @Version('1')
  async resetPassword(@Body() user: UserResetPasswordDto) {
    return this.authService.resetPassword(user)
  }
}