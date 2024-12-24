import { UserLoginDto } from "src/domain/user/dto/userLogin.dto";
import { UserToJwt } from "src/domain/user/dto/userToJwt.dto";
import { UserRegistrationDto } from "src/domain/user/dto/userToRegistration.dto";
import { User } from "src/domain/user/entities/user.entity";

export interface InterfacePostgresUserDbRepo {
    findByEmailAndUsername(email: string, username: string): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    save(user: Partial<User>): Promise<User>
}