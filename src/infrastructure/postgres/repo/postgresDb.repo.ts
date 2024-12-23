import { InjectRepository } from "@nestjs/typeorm";
import { UserLoginDto } from "src/domain/user/dto/userLogin.dto";
import { User } from "src/domain/user/entities/user.entity";
import { Repository } from "typeorm";
import * as bcryptjs from 'bcryptjs'
import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { UserToJwt } from "src/domain/user/dto/userToJwt.dto";
import { UserRegistrationDto } from "src/domain/user/dto/userToRegistration.dto";
import { Permissions } from "src/domain/auth/permissions/permissions";
import { UserToSave } from "src/domain/user/dto/userToSave.dto";


@Injectable()
export class PostgresUserDbRepo {
    constructor(
        @InjectRepository(User) private readonly UserDb: Repository<User>
    ) { }

    async registration(user: UserRegistrationDto): Promise<User> {
        try {
            const userFound = await this.UserDb.findOne({ where: { username: user.username, email: user.email } })

            if (userFound) {
                throw new NotFoundException('User already exists!')
            }

            const userToSave: UserToSave = { ...user, permissions: [Permissions.DEFAULT_PERMISSION], roles: 'USER' }

            return await this.UserDb.save(userToSave)
        } catch (e) {
            throw new HttpException(e.message || "Registration failed", e.status || 500)
        }
    }

    async login(user: UserLoginDto): Promise<UserToJwt> {
        try {
            const userFound = await this.UserDb.findOne({ where: { username: user.username, email: user.email } })

            if (!userFound) {
                throw new NotFoundException('User not found!')
            }

            if (!(await bcryptjs.compare(user.password, userFound.password))) {
                throw new Error('Password does not match!')
            }

            const { password, ...res } = userFound

            return res
        } catch (e) {
            throw new HttpException(e.message || "Login failed", e.status || 500)
        }
    }
}