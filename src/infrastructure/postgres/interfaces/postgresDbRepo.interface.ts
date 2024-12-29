import { User } from "src/domain/user/entities/user.entity";

export interface InterfacePostgresUserDbRepo {
    findByEmailAndUsername(email: string, username: string): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    save(user: Partial<User>): Promise<User>
    updatePassword(user: User, password: string): Promise<User>
}