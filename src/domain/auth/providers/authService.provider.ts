import { AuthService } from "../auth.service";

export const AuthServiceProvider = {
    provide: 'AuthService',
    useClass: AuthService
}