import { HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CONFIG } from "src/config";
import { UserToJwt } from "src/domain/user/dto/userToJwt.dto";

@Injectable()
export class MyJwtService extends JwtService {
    async generateJwtToken(user: UserToJwt): Promise<string> {
        try {
          return this.signAsync(user, { secret: CONFIG.JWT_SECRET });
        } catch (e) {
          throw new HttpException(e.message, e.status || 500)
        }
      }
}