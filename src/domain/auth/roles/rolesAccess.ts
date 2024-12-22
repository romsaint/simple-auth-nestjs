import { SetMetadata } from "@nestjs/common";
import { Roles } from "./roles";

export const RolesAccess = (...roles: string[]) => SetMetadata('roles', roles)