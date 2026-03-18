import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { SignUpDto } from "src/auth/dto/sign-up.dto";
import { SignInDto } from "src/auth/dto/sign-in.dto";
import { Auth } from "src/auth/decorators/auth.decorator";
import { AuthType } from "src/common/enums/auth-type.enum";
import { RefreshTokenDto } from "src/auth/dto/refresh-token-dto";

@Controller("auth")
@Auth(AuthType.None)
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

  @Post("refresh-token")
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
