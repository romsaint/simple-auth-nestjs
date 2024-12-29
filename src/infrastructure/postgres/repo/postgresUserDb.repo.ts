import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/domain/user/entities/user.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
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

    async updatePassword(user: User, password: string): Promise<User> {
        await this.UserDb.update(user.id, { password }); // Обновляем пароль
        return await this.UserDb.findOne({ where: { id: user.id } }); // Возвращаем обновлённую сущность
    }
}