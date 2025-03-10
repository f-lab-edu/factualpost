export const CONFIG_SERVICE = 'CONFIG_SERVICE';

export interface IConfigService {
    getPasswordRound(): number;
    getSpecialCharRegex(): RegExp;
    getSpecialType(): string;
    getJwtSecretKey(): string;
    getAccessTokenExpiresIn(): string;
    getRefreshTokenExpiresIn(): string;
    getRedisPortNumber(): string;
    getSpecialCharCount(): number;
    getUserConfigValue(key: string): number;
    getJwtSecretKey(): string;
    getPageLimit(): number;
    getArticlePageLimit(): number;
    getAlarmPageLimit(): number;
    getAlarmType(): string;
    getAdminAlarmType(): string;
}