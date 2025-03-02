import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./service/auth.service";
import { UserDTO } from "src/types";
import { ERROR_MESSAGES } from "../constants/error-message";
import { CONFIG_SERVICE, IConfigService } from "../configs/config.interface.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {

    private readonly jwtSecret: string;
    constructor(
        private readonly jwtService: JwtService,
        private readonly authService: AuthService,
        @Inject(CONFIG_SERVICE) private readonly configService: IConfigService,
    ){
        this.jwtSecret = this.configService.getJwtSecretKey();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = await this.extractAuthHeader(request);
        const token = await this.splitAuthHeader(authHeader);
        try { 
            request.user = await this.extractUserData(token);
            return true;
        } catch(err) {
            return await this.handleExpiredToken(err.message, token, request);
        }
    }

    private async handleExpiredToken(err: string, token: string, request: any): Promise<boolean> {
        if(err === 'jwt expired') {
            const userProfile = await this.decodeUserData(token);
            const refreshToken = request.cookies.refreshToken;
            request.newAccessToken = await this.authService.renewAccessToken(userProfile, refreshToken);
            request.user = await this.extractUserData(request.newAccessToken);
            return true;
        }
        throw new UnauthorizedException(err);
    }

    private async extractAuthHeader(request: any): Promise<string> {
        const authHeader = request.headers['authorization'];
        if(!authHeader) {
            throw new UnauthorizedException(ERROR_MESSAGES.MISSING_AUTH_HEADER);
        }
        return authHeader;
    }

    private async splitAuthHeader(authHeader: string): Promise<string> {
        const [bearer, token] = authHeader.split(' ');
        if(bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException(ERROR_MESSAGES.INVALID_BEARER_TOKEN);
        }
        return token;
    }

    private async extractUserData(token: string): Promise<UserDTO> {
        const userProfile = this.jwtService.verify(token, {
                secret: this.jwtSecret,
            });
        const { iat, exp, ...user } = userProfile;
        return user;
    }
    
    private async decodeUserData(token: string): Promise<UserDTO> {
        const userProfile =  this.jwtService.decode(token);
        const {iat, exp, ...user} = userProfile;
        return user;
    }

}