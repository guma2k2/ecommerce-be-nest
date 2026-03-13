import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "src/auth/dto/login.dto";
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const hashed = await bcrypt.hash(data.password, 10);

    const user = await this.userService.save({
      ...data,
      password: hashed,
      is_active: true,
    });

    return user;
  }

  async login(req: LoginDto) {
    const user = await this.userService.findByEmail(req.email);

    if (!user) throw new UnauthorizedException();

    const valid = await bcrypt.compare(req.password, user.password);

    if (!valid) throw new UnauthorizedException();

    const payload = {
      sub: user.id,
      role: user.role,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
