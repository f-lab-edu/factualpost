import { Inject, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { CACHE_MEMORY_SERVICE, ICacheMemory, ILOCK_SERVICE, ILockService } from "src/common/redis/cache.interface";
import { IARTICLE_REPOSITORY, IArticleRepository } from "src/article/repositorys/interface/article.interface";
import { BATCH_SIZE, LIKE_COUNT_SYNC_TEMP, LIKE_COUNT_SYNC, REDIS_KEY_LIKE_SEPARATOR, LIKE_CRON_TIME, LOCK_KEY, LOCK_TTL } from "../like.util";
import { UpdateLikeCount } from "src/types";
import { LikeRedisKeyAndValue } from "src/types";
import { Lock } from "redlock";

@Injectable()
export class LikeCountService {

    constructor(
        @Inject(CACHE_MEMORY_SERVICE) private readonly cacheService: ICacheMemory,
        @Inject(IARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
        @Inject(ILOCK_SERVICE) private readonly cacheLockService: ILockService,
    ){}

    @Cron(LIKE_CRON_TIME)
    async synchronizeLikeCount() {

        let lock: Lock | null = null;

        try {
            lock = await this.cacheLockService.acquire(LOCK_KEY, LOCK_TTL);
            await this.renameTransaction();
            const likeCountKeys = await this.getLikeCountKeys();
            const batches = this.chunkArrayIntoBatches(likeCountKeys, BATCH_SIZE);
            for (const batchKeys of batches) {
                const updateData = await this.processLikeCountBatch(batchKeys);
                await this.articleRepository.bulkUpdateLikeCount(updateData);
            }
            await this.removeTempKey();
        } catch (err) {
            console.error(`[Like Count Service] Update failed: ${err.message}`);
        } finally {
            if(lock) {
                await this.cacheLockService.release(LOCK_KEY);
            }
        }
    }

    async processLikeCountBatch(batchKeys: string[]): Promise<UpdateLikeCount[]> {
        const redisResults = await this.fetchLikeCountsFromCache(batchKeys);
        return this.mapRedisResultsToUpdateData(redisResults);
    }

    async renameLikeCountKey() {
        await this.cacheService.renameKey(LIKE_COUNT_SYNC, LIKE_COUNT_SYNC_TEMP);
    }

    async getLikeCountKeys() {
        return await this.cacheService.sMembers(LIKE_COUNT_SYNC_TEMP);
    }

    async fetchLikeCountsFromCache(batchKeys: string[]): Promise<LikeRedisKeyAndValue> {
        return await this.cacheService.getKeysAndLikeCount(batchKeys);
    }

    async mapRedisResultsToUpdateData(redisResults: LikeRedisKeyAndValue): Promise<UpdateLikeCount[]> {
        return Object.entries(redisResults)
            .filter(([_, count]) => count !== null)
            .map(([key, count]) => ({
                    articleId: Number(this.extractArticleIdFromKey(key)),
                    likeCount: Number(count)
            }))
    }

    async renameTransaction() {
        await this.cacheService.renameTransaction(LIKE_COUNT_SYNC, LIKE_COUNT_SYNC_TEMP);
    }

    async removeTempKey() {
        await this.cacheService.remove(LIKE_COUNT_SYNC_TEMP);
    }

    extractArticleIdFromKey(key: string): string {
        return key.split(REDIS_KEY_LIKE_SEPARATOR)[1];
    }

    chunkArrayIntoBatches<T>(array: T[], size: number): T[][] {
        return Array.from(
                            { length: Math.ceil(array.length / size) },
                            (_,i) => array.slice(i * size, i * size + size)
                        );
    }
}