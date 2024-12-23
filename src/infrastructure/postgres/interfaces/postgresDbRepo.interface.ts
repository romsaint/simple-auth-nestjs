import { UserLoginDto } from "src/domain/user/dto/userLogin.dto";
import { UserToJwt } from "src/domain/user/dto/userToJwt.dto";
import { UserRegistrationDto } from "src/domain/user/dto/userToRegistration.dto";
import { User } from "src/domain/user/entities/user.entity";

export interface InterfacePostgresUserDbRepo {
    login(user: UserLoginDto): Promise<UserToJwt>
    registration(user: UserRegistrationDto): Promise<User>
}