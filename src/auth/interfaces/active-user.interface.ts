import { UserRole } from "generated/prisma/enums";

export interface ActiveUserData {
    /*
     * The subject of the access token. The value of this property is the user Id.
     * That granted this token
     */
    sub: string;
    email: string;
    role: UserRole;
}
