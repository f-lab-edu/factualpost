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
