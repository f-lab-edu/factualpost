import { Inject, Injectable } from "@nestjs/common";
import { Like } from "src/entities/Like";
import { ILIKE_REPOSITORY, ILikeRepository } from "./repositorys/interface/like.interface";
import { CACHE_MEMORY_SERVICE, ICacheMemory } from "src/common/redis/cache.interface";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bullmq";
import { createLikeJobData, getLikeCacheKey, LIKE_QUEUE_NAME, LikeType, LIKE_SYNC_JOB, LIKE_COUNT_SYNC } from "./like.util";

@Injectable()
export class LikeService {
    constructor(
        @Inject(ILIKE_REPOSITORY) private readonly likeRepository: ILikeRepository,
        @Inject(CACHE_MEMORY_SERVICE) private readonly cacheService: ICacheMemory,
        @InjectQueue(LIKE_QUEUE_NAME) private readonly likeQueue: Queue,
    ) {}

    async addLike(userId: number, articleId: number): Promise<void> {
        const likeCacheKey = getLikeCacheKey(articleId);
        await this.cacheService.increment(likeCacheKey);
        await this.cacheService.sAdd(LIKE_COUNT_SYNC, likeCacheKey);
        await this.likeQueue.add(LIKE_SYNC_JOB, createLikeJobData(userId, articleId, LikeType.ADD));
    }

    async removeLike(userId: number, articleId: number): Promise<void> {
        const likeCacheKey = getLikeCacheKey(articleId);
        await this.cacheService.decrement(likeCacheKey);
        await this.cacheService.sAdd(LIKE_COUNT_SYNC, likeCacheKey);
        await this.likeQueue.add(LIKE_SYNC_JOB, createLikeJobData(userId, articleId, LikeType.REMOVE));
    }

    async add(userId: number, articleId: number): Promise<void> {
        const like = await this.getLike(userId, articleId);
        like?.deletedAt
        ? await this.restore(like)
        : like ?? await this.createNewLike(userId, articleId);
    }

    async remove(userId: number, articleId: number): Promise<void> {
        const like = await this.getLike(userId, articleId);
        like && !like.deletedAt && await this.softDelete(like);
    }

    private async restore(like: Like): Promise<void> {
        return this.likeRepository.restoreLike(like);
    }

    private async softDelete(like: Like): Promise<void> {
        return this.likeRepository.softDeleteLike(like);
    }

    private async getLike(userId: number, articleId: number): Promise<Like | null> {
        return await this.likeRepository.findByIds(userId, articleId);
    }

    private async createNewLike(userId: number, articleId: number): Promise<void> {
        await this.likeRepository.saveLike(userId, articleId);
    }
}
