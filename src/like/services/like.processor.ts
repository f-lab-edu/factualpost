import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { LikeService } from '../like.service';
import { LIKE_QUEUE_NAME, LikeType, LIKE_SYNC_JOB } from '../like.util';
import { LikeRequestDto } from '../dtos/like.dto';

@Processor(LIKE_QUEUE_NAME)
@Injectable()
export class LikeProcessor {
    constructor(
        private readonly likeService: LikeService,
    ) {}

    @Process(LIKE_SYNC_JOB)
    async syncLikes(job: Job) {
        const { userId, articleId, type } = job.data;
        const likeAction: LikeRequestDto = { userId, articleId };

        if(type === LikeType.ADD) {
            await this.likeService.add(likeAction);
        } else{
            await this.likeService.remove(likeAction);
        }
    }
}
