import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CONFIG } from 'src/config';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
                return req?.cookies?.Authentication
            }]),
            ignoreExpiration: false,
            secretOrKey: CONFIG.JWT_SECRET
        })
    }

    async validate(payload: any) {
        return { id: payload.sub, email: payload.email }; // Возвращаем данные пользователя
      }
}