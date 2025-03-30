import { Injectable } from "@nestjs/common";
import { LikePersistenceService } from "./services/like.persistence.service";
import { LikeCacheService } from "./services/like.cache.service";
import { LikeSyncService } from "./services/like.sync.service";
import { LikeType } from "./like.util";
import { LikeRequestDto } from "./dtos/like.dto";

@Injectable()
export class LikeService {

    constructor(
        private readonly likePersistenceService: LikePersistenceService,
        private readonly likeCacheService: LikeCacheService,
        private readonly likeSyncService: LikeSyncService
    ) {}

    async addLike(likeRequest: LikeRequestDto): Promise<void> {
        await this.likeCacheService.increaseLike(likeRequest.articleId);
        await this.likeSyncService.addSyncJob(likeRequest.userId, likeRequest.articleId, LikeType.ADD);
    }

    async removeLike(likeRequest: LikeRequestDto): Promise<void> {
        await this.likeCacheService.decreaseLike(likeRequest.articleId);
        await this.likeSyncService.addSyncJob(likeRequest.userId, likeRequest.articleId, LikeType.REMOVE);
    }

    async add(likeRequest: LikeRequestDto): Promise<void> {
        await this.likePersistenceService.add(likeRequest);
    }

    async remove(likeRequest: LikeRequestDto): Promise<void> {
        await this.likePersistenceService.remove(likeRequest);
    }

}