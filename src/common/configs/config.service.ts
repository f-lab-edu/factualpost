import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IConfigService } from "./config.interface.service";

@Injectable()
export class AppConfigService implements IConfigService {

    constructor(
        private readonly configService: ConfigService,
    ){}

    getPasswordRound(): number {
        return this.configService.get<number>('user.passwordRound')!;
    }

    getSpecialCharRegex(): RegExp {
        const pattern = this.configService.get<string>('user.specialType')!;
        return new RegExp(pattern);
    }

    getSpecialType(): string {
        return this.configService.get<string>('user.specialType')!;
    }

    getJwtSecretKey(): string {
        return this.configService.get<string>('JWT_SECRET_KEY') || 'jwtSecretKey';
    }

    getAccessTokenExpiresIn(): string {
        return this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN_MIN') || '60m';
    }

    getRefreshTokenExpiresIn(): string {
        return this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN_DAYS') || '14d';
    }

    getRedisPortNumber(): string {
        return this.configService.get<string>('REDIS_PORT_NUMBER') || '6379';
    }

    getSpecialCharCount(): number {
        return this.configService.get<number>('user.specialCharCount')!;
    }

    getUserConfigValue(key: string): number {
        return this.configService.get<number>(key)!;
    }

    getPageLimit(): number {
        return Number(this.configService.get<number>('PAGE_LIMIT'));
    }

    getArticlePageLimit(): number {
        return Number(this.configService.get<number>('ARTICLE_PAGE_LIMIT'));
    }

    getAlarmPageLimit(): number {
        return Number(this.configService.get<number>('ALARM_PAGE_LIMIT'))
    }
}