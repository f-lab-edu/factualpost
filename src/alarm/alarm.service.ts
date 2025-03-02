import { ForbiddenException, Injectable } from "@nestjs/common";
import { AlarmRepository } from "./alarm.repository";
import { LikeRepository } from "src/like/like.repository";
import { ArticleRepository } from "src/article/article.repository";
import { Alarm } from "src/entities/Alarm";
import { Like } from "src/entities/Like";
import { Article } from "src/entities/Article";
import { ERROR_MESSAGES } from "src/common/constants/error-message";

@Injectable()
export class AlarmService {
    constructor(
        private readonly alarmRepository: AlarmRepository,
        private readonly articleRepository: ArticleRepository,
        private readonly likeRepository: LikeRepository,
    ){}

    async sendAlarms(articleId: number, userId: number): Promise<void> {
        const article = await this.getArticle(articleId);
        await this.validateArticle(article, userId);
        const likedUsers = await this.getUserLikedArticle(articleId);
        const alarms = await this.createAlarms(likedUsers, article);
        await this.alarmRepository.saveAlarms(alarms);
    }

    async readAlarm(alarmId: number) {
        await this.alarmRepository.read(alarmId);
    }

    async getAlarm(userId: number, cursor: number, limit: number): Promise<Alarm[]>{
        return this.alarmRepository.getAlarms(userId, cursor, limit);
    }

    private async validateArticle(article: Article, userId: number): Promise<void> {
        if (!article.user || article.user.id !== userId) {
            throw new ForbiddenException(ERROR_MESSAGES.ONLY_POST_WRITER);
        }
    }

    private async getUserLikedArticle(articleId: number): Promise<Like[]> {
        return await this.likeRepository.findUsersWhoLikedArticle(articleId);
    }

    private async getArticle(articleId: number): Promise<Article> {
        return await this.articleRepository.findOne(articleId);
    }

    private async createAlarms(likedUsers: Like[], article: Article): Promise<Alarm[]> {
        return likedUsers.map(like => this.createAlarm(like, article));
    }  

    private createAlarm(like: Like, article: Article): Alarm {
        const alarm = new Alarm();
        alarm.user = like.user;
        alarm.article = article
        alarm.type = 'NEW_NOTIFICATION';
        alarm.message = `게시글 "${article.title}"에 대한 새로운 알림이 있습니다.`;
        alarm.isRead = false;
        return alarm;
    }  
}