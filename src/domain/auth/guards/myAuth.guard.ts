import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";;
import { CONFIG } from "src/config";
import { MyJwtService } from "../jwt/jwt.service";

@Injectable()
export class MyAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: MyJwtService
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {

            const req: Request = context.switchToHttp().getRequest()

            const token: string = req.signedCookies?.Authentication
        
            if (!token) {
                throw new UnauthorizedException()
            }

            const verified = await this.jwtService.verifyAsync(token, { secret: CONFIG.JWT_SECRET })
            
            req.user = verified

            return true
        } catch (e) {
            throw new UnauthorizedException()
        }
    }
}