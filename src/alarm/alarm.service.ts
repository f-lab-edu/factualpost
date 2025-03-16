import { BadRequestException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Alarm } from "src/entities/Alarm";
import { Like } from "src/entities/Like";
import { ArticleMeta } from "src/entities/article-meta";
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { ILIKE_REPOSITORY, ILikeRepository } from "src/like/repositorys/interface/like.interface";
import { IARTICLE_REPOSITORY, IArticleRepository } from "src/article/repositorys/interface/article.interface";
import { IALARM_REPOSITORY, IAlarmRepository } from "./repositorys/alarm.interface";
import { SearchAlarmData } from "./dtos/alarm.dto";
import { CONFIG_SERVICE, IConfigService } from "src/common/configs/config.interface.service";

@Injectable()
export class AlarmService {
    constructor(
        @Inject(IALARM_REPOSITORY) private readonly alarmRepository: IAlarmRepository,
        @Inject(IARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
        @Inject(ILIKE_REPOSITORY) private readonly likeRepository: ILikeRepository,
        @Inject(CONFIG_SERVICE) private readonly configService: IConfigService,
    ){}

    async sendAlarms(articleId: number, userId: number): Promise<void> {
        const article = await this.getArticle(articleId);
        await this.validateArticle(article, userId);
        const likedUsers = await this.getUserLikedArticle(articleId);
        await this.existLikedUser(likedUsers);
        const type = this.configService.getAlarmType();
        const alarms = await this.createAlarms(likedUsers, article, type);
        await this.alarmRepository.saveAlarms(alarms);
    }

    async sendAdminAlarms(articleId: number): Promise<void> {
        const article = await this.getArticle(articleId);
        const likedUsers = await this.getUserLikedArticle(articleId);
        await this.existLikedUser(likedUsers);
        const type = this.configService.getAdminAlarmType();
        const alarms = await this.createAlarms(likedUsers, article, type);
        await this.alarmRepository.saveAlarms(alarms);
    }

    async readAlarm(alarmId: number) {
        await this.alarmRepository.read(alarmId);
    }

    async getAlarms(userId: number, searchData: SearchAlarmData): Promise<Alarm[]>{
        return this.alarmRepository.getAlarms(userId, searchData);
    }

    private async validateArticle(article: ArticleMeta, userId: number): Promise<void> {
        if (article.user?.id !== userId) {
            throw new ForbiddenException(ERROR_MESSAGES.ONLY_POST_WRITER);
        }
    }

    private async existLikedUser(likedUsers: Like[]) {
        if(likedUsers.length === 0) {
            throw new BadRequestException(ERROR_MESSAGES.NOT_EXIST_LIKED_USER);
        }
    }

    private async getUserLikedArticle(articleId: number): Promise<Like[]> {
        return await this.likeRepository.findUsersWhoLikedArticle(articleId);
    }

    private async getArticle(articleId: number): Promise<ArticleMeta> {
        return await this.articleRepository.findOne(articleId);
    }

    private async createAlarms(likedUsers: Like[], article: ArticleMeta, type: number): Promise<Alarm[]> {
        return likedUsers.map(like => this.createAlarm(like, article, type));
    }  

    private createAlarm(like: Like, article: ArticleMeta, type: number): Alarm {
        const alarm = new Alarm();
        alarm.user = like.user;
        alarm.article = article
        alarm.type = type;
        alarm.message = `게시글 "${article.title}"에 대한 새로운 알림이 있습니다.`;
        alarm.isRead = false;
        return alarm;
    }  
}