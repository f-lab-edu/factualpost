export const LIKE_QUEUE_NAME = 'like-queue';
export const SYNC_LIKES_JOB = 'sync-likes';
export const ARTICLE_ALL_LIKE_COUNT = 'article:*:likeCount'

export enum LikeType {
    ADD = 'add',
    REMOVE = 'remove',
}

export const getLikeCacheKey = (articleId: number): string => `article:${articleId}:likeCount`;
export const createLikeJobData = (userId: number, articleId: number, type: LikeType) => ({
    userId,
    articleId,
    type,
});