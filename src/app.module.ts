import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { User } from "src/user/user.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
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
        signOptions: { expiresIn: "15Min" },
      }),
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
