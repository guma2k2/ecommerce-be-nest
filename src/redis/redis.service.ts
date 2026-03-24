import { Inject, Injectable } from "@nestjs/common";
import { Keyv } from "cacheable";
import { InvalidatedRefreshTokenError } from "src/redis/invalidated-refresh-token.error";

@Injectable()
export class RedisService {
    constructor(@Inject("KEYV_REDIS") private readonly keyv: Keyv) {}

    async insert(userId: string, tokenId: string): Promise<void> {
        await this.keyv.set(this.getKey(userId), tokenId);
    }

    async validate(userId: string, tokenId: string): Promise<boolean> {
        const storeId = await this.keyv.get<string>(this.getKey(userId));
        if (storeId !== tokenId) {
            throw new InvalidatedRefreshTokenError();
        }

        return true;
    }

    async invalidate(userId: string): Promise<void> {
        await this.keyv.delete(this.getKey(userId));
    }

    private getKey(userId: string): string {
        return `user-${userId}`;
    }
}
