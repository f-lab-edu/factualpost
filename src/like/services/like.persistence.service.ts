import { Inject, Injectable } from "@nestjs/common";
import { ILIKE_REPOSITORY, ILikeRepository } from "../repositorys/interface/like.interface";
import { LikeRequestDto } from "../dtos/like.dto";

@Injectable()
export class LikePersistenceService {
    constructor(
        @Inject(ILIKE_REPOSITORY) private readonly likeRepository: ILikeRepository
    ) {}

    async add(likeRequest: LikeRequestDto): Promise<void> {
        const like = await this.likeRepository.findByIds(likeRequest);
        like?.deletedAt
        ? await this.likeRepository.restoreLike(like)
        : like ?? await this.likeRepository.saveLike(likeRequest);
    }

    async remove(likeRequest: LikeRequestDto): Promise<void> {
        const like = await this.likeRepository.findByIds(likeRequest);
        like && !like.deletedAt && await this.likeRepository.softDeleteLike(like);
    }
}