export interface UserDTO {
    id: number;
    userId: string;
    password: string;
    createdAt: Date;
    deletedAt: Date | null;
}

export type SignInUser = Pick<UserDTO, "userId" | "password">
export type LoginUser = Pick<UserDTO, "userId" | "password">
export type UserProfile = Pick<UserDTO, "id" | "userId" | "createdAt" | "deletedAt">
export type SignOutUser = Pick<UserDTO, "userId" | "password">
export type LogoutUser = Pick<UserDTO, "id" | "userId">

export interface Tokens {
    accessToken: string,
    refreshToken: string
}
