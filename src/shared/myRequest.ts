import { Request } from "express";
import { UserToJwt } from "src/domain/user/dto/userToJwt.dto";

export class MyRequest extends Request {
    user: UserToJwt
}