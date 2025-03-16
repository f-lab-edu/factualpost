import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MEMORY_SERVICE, ICacheMemory } from 'src/common/redis/cache.interface';
import { LikeService } from './like.service';
import { getLikeCacheKey, LIKE_QUEUE_NAME, LikeType, SYNC_LIKES_JOB } from './like.util';

@Processor(LIKE_QUEUE_NAME)
@Injectable()
export class LikeProcessor {
    constructor(
        @Inject(CACHE_MEMORY_SERVICE) private readonly cacheService: ICacheMemory,
        private readonly likeService: LikeService,
    ) {}

    @Process(SYNC_LIKES_JOB)
    async syncLikes(job: Job) {
        const { userId, articleId, type } = job.data;
        const key = getLikeCacheKey(articleId);
        const likeCount = await this.cacheService.get(key);

        if(type === LikeType.ADD) {
            await this.likeService.add(userId, articleId);
            console.log(`Add article ${articleId} like count synced: ${likeCount}`);
        } else{
            await this.likeService.remove(userId, articleId);
            console.log(`Remove article ${articleId} like count synced: ${likeCount}`);
        }
    }
}
