import { Injectable, NotFoundException } from "@nestjs/common";
import { LikeRepository } from "./like.repository";
import { Like } from "src/entities/Like";

@Injectable()
export class LikeService {
    constructor(
        private readonly likeRepository: LikeRepository
    ) {}

    async addLike(userId: number, articleId: number): Promise<void> {
        const like = await this.getLike(userId, articleId);
        like?.deletedAt
        ? await this.restore(like)
        : like ?? await this.createNewLike(userId, articleId);
    }

    async removeLike(userId: number, articleId: number): Promise<void> {
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
