import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/security/auth.guard";
import { AuthService } from "src/service/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  signIn(@Body() request: Record<string, any>) {
    return this.authService.signIn(request.username, request.password);
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }
}
