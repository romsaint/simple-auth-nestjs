import { MiddlewareConsumer, Module, NestMiddleware, NestModule } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { UserServiceProvider } from "./user/providers/userService.provider";
import { PostgreTypeOrmModule } from "src/infrastructure/postgres/postgre.module";
import { AuthServiceProvider } from "./auth/providers/authService.provider";
import { MyAuthGuard } from "./auth/guards/myAuth.guard";
import { CONFIG } from "src/config";
import { MyJwtService } from "./auth/jwt/jwt.service";


@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: CONFIG.JWT_SECRET, // Замените на ваш секретный ключ
        }),
        PostgreTypeOrmModule
    ],
    providers: [UserServiceProvider, AuthServiceProvider, MyAuthGuard, MyJwtService],
    exports: [UserServiceProvider, AuthServiceProvider, MyAuthGuard, MyJwtService]
})
export class DomainModule { }