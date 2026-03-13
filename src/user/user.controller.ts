import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/common/decorator/role.decorator";
import { UserRole } from "src/common/enums/user.enum";
import { RolesGuard } from "src/common/guard/role.guard";
import { ResponseUtil } from "src/common/utils/response.util";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async create(@Body(ZodValidationPipe) createUserDto: CreateUserDto): Promise<any> {
    return ResponseUtil.successResponse(await this.userService.create(createUserDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async findAll() {
    return ResponseUtil.successResponse(await this.userService.findAll());
  }
}
