import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { UserServiceProvider } from "./user/providers/userService.provider";
import { PostgreTypeOrmModule } from "src/infrastructure/postgres/postgre.module";
import { AuthServiceProvider } from "./auth/providers/authService.provider";
import { MyAuthGuard } from "./auth/guards/myAuth.guard";
import { CONFIG } from "src/config";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: CONFIG.JWT_SECRET, // Замените на ваш секретный ключ
        }),
        PostgreTypeOrmModule
    ],
    providers: [UserServiceProvider, AuthServiceProvider, MyAuthGuard, JwtService],
    exports: [UserServiceProvider, AuthServiceProvider, MyAuthGuard, JwtService]
})
export class DomainModule { }