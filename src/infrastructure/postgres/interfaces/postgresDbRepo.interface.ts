import { UserLoginDto } from "src/domain/user/dto/userLogin.dto";
import { UserToJwt } from "src/domain/user/dto/userToJwt.dto";

export interface InterfacePostgresUserDbRepo {
    login(user: UserLoginDto): Promise<UserToJwt>
}