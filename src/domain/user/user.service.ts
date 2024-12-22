import { HttpException, Injectable } from "@nestjs/common";
import { UserToJwt } from "./dto/userToJwt.dto";
import { MyRequest } from "src/shared/myRequest";

@Injectable()
export class UserService {
    getCurrentUser(req: MyRequest): UserToJwt {
        try{
            return req.user
        }catch(e) {
            throw new HttpException(e.message || "Error", e.status || 500)
        }
    }
}