import { Response } from "express";
import { UserLoginDto } from "src/domain/user/dto/userLogin.dto";
import { UserResetPasswordDto } from "src/domain/user/dto/userResetPassword.dto";
import { UserToJwt } from "src/domain/user/dto/userToJwt.dto";
import { UserRegistrationDto } from "src/domain/user/dto/userToRegistration.dto";

export interface InterfaceAuthService {
    login(user: UserLoginDto, res: Response): Promise<UserToJwt>
    registration(user: UserRegistrationDto, res: Response): Promise<UserToJwt>
    resetPassword(user: UserResetPasswordDto): Promise<{[anyMsg: string]: string}>
}