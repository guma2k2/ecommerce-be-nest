import KeyvRedis, { Keyv } from "@keyv/redis";
import { Module } from "@nestjs/common";
import { RedisService } from "src/redis/redis.service";

@Module({
    providers: [
        {
            provide: "KEYV_REDIS",
            useFactory: () => {
                const store = new KeyvRedis({
                    url: process.env.REDIS_URL || "redis://localhost:6379",
                });

                const keyv = new Keyv({ store });
                keyv.on("error", (err) => {
                    console.log("KeyV Redis error: ", err);
                });

                return keyv;
            },
        },
        RedisService,
    ],
    exports: ["KEYV_REDIS"],
})
export class RedisModule {}
