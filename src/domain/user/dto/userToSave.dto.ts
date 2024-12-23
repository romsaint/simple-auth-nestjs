import { UserDtoBase } from "./userBase.dto";

export class UserToSave extends UserDtoBase {
    permissions: string[] 
    roles: string
    email: string
}