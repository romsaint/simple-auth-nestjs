import { HttpException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserLoginDto } from 'src/domain/user/dto/userLogin.dto';
import { UserToJwt } from 'src/domain/user/dto/userToJwt.dto';
import { InterfaceAuthService } from './interfaces/authService.interface';
import { InterfacePostgresUserDbRepo } from 'src/infrastructure/postgres/interfaces/postgresDbRepo.interface';
import { CONFIG } from 'src/config';
import { UserRegistrationDto } from '../user/dto/userToRegistration.dto';
import { MyRequest } from 'src/shared/myRequest';
import { UserToSave } from '../user/dto/userToSave.dto';
import * as bcryptjs from 'bcryptjs'
import { Permissions } from './permissions/permissions';


@Injectable()
export class AuthService implements InterfaceAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('PostgresUserDbRepo') private readonly userDbRepo: InterfacePostgresUserDbRepo,
  ) { }

  async login(user: UserLoginDto, res: Response): Promise<UserToJwt> {
    try {
      const isUserExists = await this.userDbRepo.findByEmailAndUsername(user.email, user.username)
      if (!isUserExists) {
        throw new NotFoundException('User does not exists!')
      }

      if (!(await bcryptjs.compare(user.password, isUserExists.password))) {
        throw new Error('Password does not match!')
      }
  
      const { password, ...userToJwt } = isUserExists

      const token = await this.generateJwtToken(userToJwt)

      res.cookie('Authentication', token, {
        httpOnly: true, // Только для сервера
        secure: false, // Установите true, если используете HTTPS
        sameSite: 'strict', // Защита от CSRF
        signed: true
      });

      return userToJwt
    } catch (e) {
      throw new HttpException(e.message || "Login failed", e.status || 500)
    }
  }

  async registration(user: UserRegistrationDto, res: Response): Promise<UserToJwt> {
    try {
      const isUserExists = await this.userDbRepo.findByEmailAndUsername(user.email, user.username)

      if (isUserExists) {
        throw new UnauthorizedException('User already exists!')
      }

      const passwordHashed = await bcryptjs.hash(user.password, 10)
      const userToSave: UserToSave = { ...user, permissions: [Permissions.DEFAULT_PERMISSION], roles: 'USER', password: passwordHashed }
      const savedUser = await this.userDbRepo.save(userToSave)

      const { password, ...userToJwt } = savedUser

      const token = await this.generateJwtToken(userToJwt)

      res.cookie('Authentication', token, {
        httpOnly: true, // Только для сервера
        secure: false, // Установите true, если используете HTTPS
        sameSite: 'strict', // Защита от CSRF
        signed: true
      });

      return userToJwt
    } catch (e) {
      throw new HttpException(e.message, e.status || 500)
    }
  }

  private async generateJwtToken(user: UserToJwt): Promise<string> {
    try {
      return this.jwtService.signAsync(user, { secret: CONFIG.JWT_SECRET });
    } catch (e) {
      throw new HttpException(e.message, e.status || 500)
    }
  }
}