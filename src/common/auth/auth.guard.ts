import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./service/auth.service";
import { ConfigService } from "@nestjs/config";
import { UserDTO } from "src/types";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ){}

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
            return true;
        }
        throw new UnauthorizedException(err);
    }

    private async extractAuthHeader(request: any): Promise<string> {
        const authHeader = request.headers['authorization'];
        if(!authHeader) {
            throw new UnauthorizedException('Authorization header not found');
        }
        return authHeader;
    }

    private async splitAuthHeader(authHeader: string): Promise<string> {
        const [bearer, token] = authHeader.split(' ');
        if(bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid Bearer token');
        }
        return token;
    }

    private async extractUserData(token: string): Promise<UserDTO> {
        const userProfile = this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET_KEY')
            }
        )
        const {iat, exp, ...user} = userProfile;
        return user;
    }

    private async decodeUserData(token: string): Promise<UserDTO> {
        const userProfile =  this.jwtService.decode(token);
        const {iat, exp, ...user} = userProfile;
        return user;
    }

}