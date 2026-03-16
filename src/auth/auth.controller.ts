import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { SignUpDto } from "src/auth/dto/sign-up.dto";
import { SignInDto } from "src/auth/dto/sign-in.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("sign-up")
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post("sign-in")
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
