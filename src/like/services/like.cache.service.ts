import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MEMORY_SERVICE, ICacheMemory } from "src/common/redis/cache.interface";
import { getLikeCacheKey, LIKE_COUNT_SYNC } from "../like.util";

@Injectable()
export class LikeCacheService {

    constructor(
        @Inject(CACHE_MEMORY_SERVICE) private readonly cacheService: ICacheMemory
    ) {}

    async increaseLike(articleId: number): Promise<void> {
        const likeCacheKey = getLikeCacheKey(articleId);
        await this.cacheService.increment(likeCacheKey);
        await this.cacheService.sAdd(LIKE_COUNT_SYNC, likeCacheKey);
        
    }

    async decreaseLike(articleId: number): Promise<void> {
        const likeCacheKey = getLikeCacheKey(articleId);
        await this.cacheService.decrement(likeCacheKey);
        await this.cacheService.sAdd(LIKE_COUNT_SYNC, likeCacheKey);
    }

}