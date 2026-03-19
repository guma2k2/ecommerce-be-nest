import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { SignInDto } from "src/auth/dto/sign-in.dto";
import jwtConfig from "src/auth/config/jwt.config";
import type { ConfigType } from "@nestjs/config";
import { User } from "src/user/user.entity";
import { randomUUID } from "crypto";
import { ActiveUserData } from "src/auth/interfaces/active-user.interface";
import { SignUpDto } from "src/auth/dto/sign-up.dto";
import { UserRole } from "src/common/enums/user.enum";
import { BcryptService } from "src/auth/services/bcrypt.service";
import { RefreshTokenDto } from "src/auth/dto/refresh-token-dto";
import { RefreshTokenService } from "src/auth/services/refresh-token.service";
@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private refreshTokenService: RefreshTokenService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly bcryptService: BcryptService,
    ) {}

    async signUp(signUpDto: SignUpDto) {
        console.log("received signUpDto", signUpDto);
        const exitedUser = await this.userService.findByEmail(signUpDto.email);
        if (exitedUser) {
            throw new UnauthorizedException("User already exists");
        }

        const encryptedPassword = await this.bcryptService.hash(signUpDto.password);
        console.log("encryptedPassword", encryptedPassword);
        const user = new User();
        user.email = signUpDto.email;
        user.password = encryptedPassword;
        user.is_active = true;
        user.first_name = signUpDto.first_name;
        user.last_name = signUpDto.last_name;
        user.role = UserRole.ADMIN;
        await this.userService.create(user);
    }

    async signIn(signInDto: SignInDto) {
        console.log("received signInDto", signInDto);
        const user = await this.userService.findByEmail(signInDto.email);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        const isPasswordValid = await this.bcryptService.compare(signInDto.password, user.password);

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

        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);

        // TODO: Insert refresh token to db
        await this.refreshTokenService.save({
            refreshToken: refreshTokenId,
        });
        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto) {
        try {
            const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
                Pick<ActiveUserData, "sub"> & { refreshTokenId: string }
            >(refreshTokenDto.refreshToken, {
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
            });

            const user = await this.userService.getById(sub);
            if (!user) {
                throw new UnauthorizedException("User not found");
            }

            const isValid = await this.refreshTokenService.validate(user.id, refreshTokenId);
            if (!isValid) {
                throw new UnauthorizedException("Refresh token is not valid");
            }

            await this.refreshTokenService.delete(refreshTokenDto);

            return this.generateToken(user);
        } catch (error) {
            throw new UnauthorizedException();
        }
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
