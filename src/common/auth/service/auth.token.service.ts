import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from 'jsonwebtoken';
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { UserDTO, Tokens } from "src/types";

@Injectable()
export class AuthTokenService {

    private readonly jwtSercretKey: string;
    private readonly accessTokenExpire: string;
    private readonly refreshTokenExpire: string;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {
        this.jwtSercretKey = this.configService.get<string>('JWT_SECRET_KEY') || 'jwtSecretKey';
        this.accessTokenExpire = this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN_MIN') || '60m';
        this.refreshTokenExpire = this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN_DAYS') || '14d';
    }

    async generateTokens(payload: JwtPayload): Promise<Tokens> {
        const tokenOptions = {
            secret: this.jwtSercretKey
        }

        const tokens: Tokens = {
            accessToken: this.jwtService.sign(payload, { 
                ...tokenOptions, 
                expiresIn: this.accessTokenExpire 
            }),
            refreshToken: this.jwtService.sign({}, { 
                ...tokenOptions, 
                expiresIn: this.refreshTokenExpire 
            }),
        };
        return tokens;
    }

    async generateNewAccessToken(userData: UserDTO): Promise<string> {
        return this.jwtService.sign(userData, { 
            secret: this.jwtSercretKey
        });
    }

    async verifyRefreshToken(providedToken: string, storedToken: string): Promise<void> {
        if (providedToken !== storedToken) {
            throw new UnauthorizedException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
        }
    }
}