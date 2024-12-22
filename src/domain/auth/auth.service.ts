import { HttpException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserLoginDto } from 'src/domain/user/dto/userLogin.dto';
import { UserToJwt } from 'src/domain/user/dto/userToJwt.dto';
import { InterfaceAuthService } from './interfaces/authService.interface';
import { InterfacePostgresUserDbRepo } from 'src/infrastructure/postgres/interfaces/postgresDbRepo.interface';
import { CONFIG } from 'src/config';


@Injectable()
export class AuthService implements InterfaceAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('PostgresUserDbRepo') private readonly postgresDbRepo: InterfacePostgresUserDbRepo,
  ) { }

  async login(user: UserLoginDto, res: Response): Promise<{ user: UserToJwt }> {
    try {

      const userFound = await this.postgresDbRepo.login(user)

      const token = await this.generateJwtToken(userFound)

      res.cookie('Authentication', token, {
        httpOnly: true, // Только для сервера
        secure: false, // Установите true, если используете HTTPS
        sameSite: 'strict', // Защита от CSRF
        signed: true
      });

      return { user: userFound }
    } catch (e) {
      throw new HttpException(e.message || "Login failed", e.status || 500)
    }
  }

  private async generateJwtToken(user: UserToJwt): Promise<string> {
    try {
      return this.jwtService.signAsync(user, {secret: CONFIG.JWT_SECRET});
    } catch (e) {
      throw new HttpException(e.message, e.status || 500)
    }
  }
}