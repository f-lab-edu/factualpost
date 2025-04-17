import { Like } from "src/entities/Like"
import { LikeRequestDto } from "src/like/dtos/like.dto";

export const ILIKE_REPOSITORY = 'ILIKE_REPOSITORY';

export interface ILikeRepository {
    findByIds(likeRequest: LikeRequestDto): Promise<Like | null>
    saveLike(likeRequest: LikeRequestDto): Promise<Like>
    softDeleteLike(like: Like): Promise<void>
    restoreLike(like: Like): Promise<void>
    findUsersWhoLikedArticle(articleId: number): Promise<Like[]>
}