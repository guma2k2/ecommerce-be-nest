import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { SignInDto } from "src/auth/dto/sign-in.dto";
import jwtConfig from "src/auth/config/jwt.config";
import type { ConfigType } from "@nestjs/config";
import { User } from "src/user/user.entity";
import { randomUUID } from "crypto";
import { ActiveUserData } from "src/auth/interfaces/active-user.interface";
import { SignUpDto } from "src/auth/dto/sign-up.dto";
import { UserRole } from "src/common/enums/user.enum";
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const user = new User();
    user.email = signUpDto.email;
    user.password = signUpDto.password;
    user.is_active = true;
    user.first_name = signUpDto.first_name;
    user.last_name = signUpDto.last_name;
    user.role = UserRole.ADMIN;
    await this.userService.create(user);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const isPasswordValid = await bcrypt.compare(signInDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Password does not match");
    }

    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfiguration.accessTokenTtl, {
        email: user.email,
        role: user.role,
      }),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);

    // TODO: Insert refresh token to db
    return {
      accessToken,
      refreshToken,
    };
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
