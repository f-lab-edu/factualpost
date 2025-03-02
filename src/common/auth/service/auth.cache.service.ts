import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { CACHE_MEMORY_SERVICE, ICacheMemory } from "src/common/redis/cache.interface";

@Injectable()
export class AuthCacheService {
    constructor(
        @Inject(CACHE_MEMORY_SERVICE) private readonly cachedMemory: ICacheMemory
    ){}

    async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
        return await this.cachedMemory.set(userId, refreshToken);
    }

    async getRefreshToken(userId: string): Promise<string> {
        const storedRefreshToken = await this.cachedMemory.get(userId);
        if(!storedRefreshToken) {
            throw new UnauthorizedException(ERROR_MESSAGES.REFRESH_TOKEN_NOT_FOUND);
        }
        return storedRefreshToken;
    }

    async deleteRefreshToken(id: string): Promise<void> {
        this.cachedMemory.remove(id);
    }

}