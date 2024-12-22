import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { concatAll, Observable } from "rxjs";
import { CONFIG } from "src/config";
import { AuthService } from "src/domain/auth/auth.service";
import { UserToJwt } from "src/domain/user/dto/userToJwt.dto";

@Injectable()
export class MyAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService
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