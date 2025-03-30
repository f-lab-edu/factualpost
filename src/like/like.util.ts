export const LIKE_QUEUE_NAME = 'like-queue';
export const LIKE_SYNC_JOB = 'sync-likes';
export const LIKE_COUNT_SYNC = 'LIKE_COUNT_SYNC';
export const LIKE_COUNT_SYNC_TEMP = 'LIKE_COUNT_SYNC_TEMP';
export const REDIS_KEY_LIKE_SEPARATOR = ':';
export const LIKE_CRON_TIME = '*/1 * * * *';
export const BATCH_SIZE = 100;

export enum LikeType {
    ADD = 'add',
    REMOVE = 'remove',
}

export interface SyncLikeData {
    userId: number;
    articleId: number;
    type: LikeType;
}

export const getLikeCacheKey = (articleId: number): string => `article:${articleId}:likeCount`;
export const createLikeJobData = (userId: number, articleId: number, type: LikeType) => ({
    userId,
    articleId,
    type,
});