import { Like } from "src/entities/Like"

export const ILIKE_REPOSITORY = 'ILIKE_REPOSITORY';

export interface ILikeRepository {
    findByIds(userId: number, articleId: number): Promise<Like | null>
    saveLike(userId: number, articleId: number): Promise<Like>
    softDeleteLike(like: Like): Promise<void>
    restoreLike(like: Like): Promise<void>
    findUsersWhoLikedArticle(articleId: number): Promise<Like[]>
}