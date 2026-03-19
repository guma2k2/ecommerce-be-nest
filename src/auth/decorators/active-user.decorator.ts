import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ActiveUserData } from "src/auth/interfaces/active-user.interface";
import { REQUEST_USER_KEY } from "src/common/constant/auth.constants";

export const ActiveUser = createParamDecorator(
    (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>();
        const user: ActiveUserData | undefined = request[REQUEST_USER_KEY];
        return field ? user?.[field] : user;
    },
);
