import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { User } from "generated/prisma/client";
import { Auth } from "src/auth/decorators/auth.decorator";
import { ResponseData } from "src/common/dto/response-data.dto";
import { AuthType } from "src/common/enums/auth-type.enum";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";

@Controller("user")
@Auth(AuthType.Bearer)
export class UserController {
    constructor(private readonly userService: UserService) {}

    // @Post()
    // async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    //     return ResponseUtil.successResponse(await this.userService.create(createUserDto));
    // }

    @Get()
    async findAll() {
        const users: User[] = await this.userService.findAll();
        return ResponseData.success(users);
    }
}
