import { UserService } from "../user.service";

export const UserServiceProvider = {
    provide: 'UserService',
    useClass: UserService
}