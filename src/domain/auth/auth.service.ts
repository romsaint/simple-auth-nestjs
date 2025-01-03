import { HttpException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { UserLoginDto } from 'src/domain/user/dto/userLogin.dto';
import { UserToJwt } from 'src/domain/user/dto/userToJwt.dto';
import { InterfaceAuthService } from './interfaces/authService.interface';
import { InterfacePostgresUserDbRepo } from 'src/infrastructure/postgres/interfaces/postgresDbRepo.interface';
import { UserRegistrationDto } from '../user/dto/userToRegistration.dto';
import { UserToSave } from '../user/dto/userToSave.dto';
import * as bcryptjs from 'bcryptjs'
import { Permissions } from './permissions/permissions';
import { MyJwtService } from './jwt/jwt.service';
import { UserResetPasswordDto } from '../user/dto/userResetPassword.dto';


@Injectable()
export class AuthService implements InterfaceAuthService {
  constructor(
    private readonly myJwtService: MyJwtService,
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

      const token = await this.myJwtService.generateJwtToken(userToJwt)

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

      const token = await this.myJwtService.generateJwtToken(userToJwt)

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

  async resetPassword(user: UserResetPasswordDto): Promise<{[anyMsg: string]: string}> {
    try {
      const isUserExists = await this.userDbRepo.findByEmailAndUsername(user.email, user.username)
      if (!isUserExists) {
        throw new NotFoundException('User does not exists!')
      }

      if (!(await bcryptjs.compare(user.password, isUserExists.password))) {
        throw new Error('Password does not match!')
      }
      
      const password = await bcryptjs.hash(user.newPassword, 10)
      await this.userDbRepo.updatePassword(user, password)

      return {msg: "Success!"}
    } catch (e) {
      throw new HttpException(e.message, e.status || 500)
    }
  }
}