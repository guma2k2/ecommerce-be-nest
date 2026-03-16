import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UserRole } from "src/common/enums/user.enum";
import { ResponseUtil } from "src/common/utils/response.util";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return ResponseUtil.successResponse(await this.userService.create(createUserDto));
  }

  @Get()
  async findAll() {
    return ResponseUtil.successResponse(await this.userService.findAll());
  }
}
