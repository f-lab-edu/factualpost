import { Inject, Injectable } from "@nestjs/common";
import { createLikeJobData, LIKE_QUEUE_NAME, LIKE_SYNC_JOB, LikeType } from "../like.util";
import { Queue } from "bullmq";
import { InjectQueue } from "@nestjs/bull";

@Injectable()
export class LikeSyncService {
    constructor(
        @InjectQueue(LIKE_QUEUE_NAME) private readonly likeQueue: Queue
    ) {}

    async addSyncJob(userId: number, articleId: number, type: LikeType): Promise<void> {
        await this.likeQueue.add(LIKE_SYNC_JOB, createLikeJobData(userId, articleId, type));
    }
}