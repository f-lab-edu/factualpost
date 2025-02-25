import { Request, Response, NextFunction } from 'express';

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

export interface UserInformation {
    id: number;
    userId: string;
    password?: string;
}

export interface UserDTOWithPassword {
    id: number;
    userId: string;
    password: string;
}

export type AuthStrategyType = 'JWT' | 'Email' | '1won' | 'local';

export interface ResolverResult {
	statusCode: number;
	response: {
        message: string;
        location?: string;
    };
}

export interface ResolverType {
	(req: Request, res: Response, next?: NextFunction): Promise<ResolverResult>
}

export interface AuthToken {
    accessToken: string;
    refreshToken: string;
}

export interface logoutResponse {
    header: string;
    cookie: string;
}

export interface loginResponse {
    header: string;
    type: string;
    accessToken: string;
}

export interface loginCookie {
    refreshToken: string;
    cookieConfig: {
        httpOnly: boolean;
        secure: boolean;
        sameSite: 'Strict' | 'Lax' | 'None';
        maxAge: number;
    };
}

export interface AuthenticationResult {
    loginHeader: loginResponse;
    loginCookie: loginCookie;
}

export interface ExceptionType {
    status: number;
    message: string | symbol;
}

export interface ArticleData {
    id?: number;
    userId?: string;
    title: string;
    contents: string;
}

export interface ArticleParams {
    userId: string;
    title: string;
    contents: string;
    articleId?: number;
}

export interface ExtendedArticleData extends Request {
    extractedArticleData?: {
        articleId?: number;
        title: string;
        contents: string;
        userId: string;
    }
}

export interface UserParams {
    userId: string;
    password: string;
}

export interface ExtendedUserData extends Request {
    extractedUserData?: {
        userId: string;
        password: string;
    }
}