import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { CONFIG_SERVICE, IConfigService } from "src/common/configs/config.interface.service";
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { CACHE_MEMORY_SERVICE, ICacheMemory } from "src/common/redis/cache.interface";

@Injectable()
export class AuthCacheService {
    private readonly refreshTokenExpires: number;

    constructor(
        @Inject(CACHE_MEMORY_SERVICE) private readonly cachedMemory: ICacheMemory,
        @Inject(CONFIG_SERVICE) private readonly configService: IConfigService
    ){
        this.refreshTokenExpires = this.configService.getRefreshTokenExpiresInRedis();
    }

    async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await this.cachedMemory.set(userId, refreshToken, this.refreshTokenExpires);
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