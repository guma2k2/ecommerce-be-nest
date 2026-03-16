import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { UserModule } from "src/user/user.module";
import { BcryptService } from "src/auth/services/bcrypt.service";
import { APP_GUARD } from "@nestjs/core";
import { AccessTokenGuard } from "src/auth/guards/access-token/access-token.guard";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "src/auth/config/jwt.config";
import { AuthenticationGuard } from "src/auth/guards/authentication/authentication.guard";

@Module({
  imports: [UserModule, JwtModule.registerAsync(jwtConfig.asProvider())],
  controllers: [AuthController],
  providers: [
    AuthService,
    BcryptService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
  ],
})
export class AuthModule {}
