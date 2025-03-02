import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from 'jsonwebtoken';
import { CONFIG_SERVICE, IConfigService } from "src/common/configs/config.interface.service";
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { UserDTO, Tokens } from "src/types";

@Injectable()
export class AuthTokenService {

    private readonly jwtSercretKey: string;
    private readonly accessTokenExpire: string;
    private readonly refreshTokenExpire: string;

    constructor(
        private readonly jwtService: JwtService,
        @Inject(CONFIG_SERVICE) private readonly configService: IConfigService
    ) {
        this.jwtSercretKey = this.configService.getJwtSecretKey();
        this.accessTokenExpire = this.configService.getAccessTokenExpiresIn();
        this.refreshTokenExpire = this.configService.getRefreshTokenExpiresIn();
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