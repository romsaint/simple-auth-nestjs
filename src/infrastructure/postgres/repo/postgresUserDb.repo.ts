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
import { InterfacePostgresUserDbRepo } from "../interfaces/postgresDbRepo.interface";


@Injectable()
export class PostgresUserDbRepo implements InterfacePostgresUserDbRepo {
    constructor(  
        @InjectRepository(User) private readonly UserDb: Repository<User>
    ) { }

    async findByEmailAndUsername(email: string, username: string): Promise<User | null> {
        return this.UserDb.findOne({ where: { email, username } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.UserDb.findOne({ where: { email } });
    }

    async save(user: UserToSave): Promise<User> {
        return this.UserDb.save(user);
    }

    async updatePassword(user: User, password: string) {
        return await this.UserDb.update({password}, user)
    }
}