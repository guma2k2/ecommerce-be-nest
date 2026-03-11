import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity"; // Verify this path
import { UserService } from "src/service/user.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "src/controller/auth.controller";
import { AuthService } from "src/service/auth.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      // FIXED: Corrected the template literal and logic
      envFilePath: [`.env.${process.env.NODE_ENV}`, ".env"],
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("DATABASE_HOST"),
        // FIXED: Ensure port is a number
        port: configService.get<number>("DATABASE_PORT", 5432),
        username: configService.get<string>("DATABASE_USERNAME"),
        password: configService.get<string>("DATABASE_PASSWORD") || "password",
        database: configService.get<string>("DATABASE_DBNAME"),
        entities: [User],
        // Safety: Disable synchronize in production
        synchronize: configService.get("NODE_ENV") !== "prod",
      }),
    }),

    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "60s" },
      }),
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, UserService, AuthService],
})
export class AppModule {}
