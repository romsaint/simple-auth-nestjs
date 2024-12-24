import { User } from "../entities/user.entity";

export class UserResetPasswordDto extends User {
    newPassword: string;
}