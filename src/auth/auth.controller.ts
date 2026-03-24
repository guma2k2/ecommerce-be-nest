import { Controller, Post, Body, Res } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { SignUpDto } from "src/auth/dto/sign-up.dto";
import { SignInDto } from "src/auth/dto/sign-in.dto";
import { Auth } from "src/auth/decorators/auth.decorator";
import { AuthType } from "src/common/enums/auth-type.enum";
import { RefreshTokenDto } from "src/auth/dto/refresh-token-dto";
import { ResponseData } from "src/common/dto/response-data.dto";
import type { Response } from "express";
import { ConfigService } from "@nestjs/config";
@Controller("auth")
@Auth(AuthType.None)
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) {}

    @Post("sign-up")
    async signUp(@Body() signUpDto: SignUpDto) {
        const res = await this.authService.signUp(signUpDto);
        return ResponseData.success(res);
    }

    @Post("sign-in")
    async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken } = await this.authService.signIn(signInDto);
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: this.configService.get("REFRESH_TOKEN_TTL") || 864000,
            path: "auth/refresh",
        });
        return ResponseData.success(accessToken);
    }

    @Post("refresh-token")
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshTokens(refreshTokenDto);
    }
}
