import { UserToJwt } from "../dto/userToJwt.dto";

export interface InterfaceUserService {
    getCurrentUser(req: Request): UserToJwt
}