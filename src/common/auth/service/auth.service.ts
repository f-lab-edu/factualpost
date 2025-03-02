import { Injectable } from "@nestjs/common";
import { Tokens, UserDTO } from "src/types";
import { UserProfile } from "src/user/dtos/user.dto";
import { JwtPayload } from 'jsonwebtoken';
import { AuthTokenService } from "./auth.token.service";
import { AuthCacheService } from "./auth.cache.service";
import { LogoutUser } from "src/user/dtos/user.dto";

@Injectable()
export class AuthService {

    constructor(
        private readonly authTokenService: AuthTokenService,
        private readonly authCacheService: AuthCacheService,
    ) {}

    async authenticateUser(userProfile: UserProfile): Promise<Tokens> {
        const tokens = await this.authTokenService.generateTokens(userProfile);
        await this.authCacheService.storeRefreshToken(userProfile.id.toString(), tokens.refreshToken);
        return tokens;
    }
    
    async renewAccessToken(userData: UserDTO, refreshToken: string): Promise<JwtPayload> {
        const storedRefreshToken = await this.authCacheService.getRefreshToken(userData.id.toString());
        await this.authTokenService.verifyRefreshToken(refreshToken, storedRefreshToken);
        return await this.authTokenService.generateNewAccessToken(userData);
    }

    async logOutUser(user: LogoutUser) {
        await this.authCacheService.deleteRefreshToken(user.id.toString());
    }
}