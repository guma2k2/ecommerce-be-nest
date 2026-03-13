import { Controller, Post, Body, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "src/auth/dto/login.dto";
import { ZodValidationPipe } from "nestjs-zod";
import { RegisterDto } from "src/auth/dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/login")
  async login(@Body(ZodValidationPipe) body: LoginDto) {
    return this.authService.login(body);
  }

  @Post("/register")
  async register(@Body(ZodValidationPipe) body: RegisterDto) {
    console.log("body", body);
    return this.authService.register(body);
  }
}
