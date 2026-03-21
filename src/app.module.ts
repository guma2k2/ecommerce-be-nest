import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import KeyvRedis, { Keyv } from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { CacheableMemory } from "cacheable";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`.env.${process.env.NODE_ENV}`, ".env"],
            isGlobal: true,
        }),
        CacheModule.registerAsync({
            useFactory: async () => {
                return {
                    stores: [
                        new Keyv({
                            store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
                        }),
                        new KeyvRedis("redis://localhost:6379"),
                    ],
                };
            },
        }),
        AuthModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
    ],
})
export class AppModule {}
