import { UserRole } from "src/common/enums/user.enum";

export interface ActiveUserData {
    /*
     * The subject of the access token. The value of this property is the user Id.
     * That granted this token
     */
    sub: string;
    email: string;
    role: UserRole;
}
