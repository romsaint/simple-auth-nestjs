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
            const userFoundEmail = await this.UserDb.findOne({ where: { email: user.email } })
            const userFoundUsername = await this.UserDb.findOne({ where: { username: user.username } })
            console.log(user)
            if (userFoundEmail || userFoundUsername) {
                throw new NotFoundException('User already exists!')
            }
            const passwordHashed = await bcryptjs.hash(user.password, 10)
            const userToSave: UserToSave = { ...user, permissions: [Permissions.DEFAULT_PERMISSION], roles: 'USER', password: passwordHashed }

            return await this.UserDb.save(userToSave)
        } catch (e) {
            throw new HttpException(e.message || "Registration failed", e.status || 500)
        }
    }

    async login(user: UserLoginDto): Promise<UserToJwt> {
        try {
            const userFoundEmail = await this.UserDb.findOne({ where: { email: user.email } })
            const userFoundUsername = await this.UserDb.findOne({ where: { username: user.username } })

            if (!userFoundEmail || !userFoundUsername) {
                throw new NotFoundException('User does not exists!')
            }


            if (!(await bcryptjs.compare(user.password, userFoundEmail.password))) {
                throw new Error('Password does not match!')
            }

            const { password, ...res } = userFoundEmail

            return res
        } catch (e) {
            throw new HttpException(e.message || "Login failed", e.status || 500)
        }
    }
}