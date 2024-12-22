import { IsArray, IsEmail, IsEnum, IsIn, IsNotEmpty, validate } from "class-validator";
import { Permissions } from "src/domain/auth/permissions/permissions";
import { Roles } from "src/domain/auth/roles/roles";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty({ message: "Username is required" })
    username: string;

    @Column()
    @IsNotEmpty({ message: "Password is required" })
    password: string;

    @Column()
    @IsEmail({}, { message: "Invalid email format" })
    email: string;

    @Column({ type: 'varchar', length: 20, default: Roles.USER})
    @IsIn(Object.values(Roles))
    roles: string;

    @Column({ type: 'jsonb', default: [Permissions.DEFAULT_PERMISSION]})
    @IsArray({ message: "Permissions must be an array" })
    @IsIn(Object.values(Permissions))
    permissions: string[];


    @BeforeInsert()
    async errorsHandlingBeforeInsert() {
        const errors = await validate(this);
        if (errors.length > 0) {
            const errorMessages = errors.map(err => Object.values(err.constraints)).flat();
            throw new Error(`Validation error: ${errorMessages.join(", ")}`);
        }
    }
    @BeforeUpdate()
    async errorsHandlingBeforeUpdate() {
        const errors = await validate(this);
        if (errors.length > 0) {
            const errorMessages = errors.map(err => Object.values(err.constraints)).flat();
            throw new Error(`Validation error: ${errorMessages.join(", ")}`);
        }
    }
}