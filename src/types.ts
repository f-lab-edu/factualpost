export interface UserDTO {
    id: number;
    userId: string;
    password: string;
    createdAt: Date;
    deletedAt: Date | null;
}

export interface Tokens {
    accessToken: string,
    refreshToken: string
}

export interface UpdateLikeCount {
    articleId: number;
    likeCount: number;
}

export interface LikeRedisKeyAndValue {
    [key: string]: string | null;
}