import { Response } from "express";
import { UserLoginDto } from "src/domain/user/dto/userLogin.dto";
import { UserToJwt } from "src/domain/user/dto/userToJwt.dto";

export interface InterfaceAuthService {
    login(user: UserLoginDto, res: Response): Promise<{ user: UserToJwt }>
}