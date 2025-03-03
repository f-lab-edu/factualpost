import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { RemoveArticle, UpdateArticle } from "./dtos/article.dto";
import { Article } from "src/entities/Article";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { CONFIG_SERVICE, IConfigService } from "src/common/configs/config.interface.service";

@Injectable()
export class ArticleRepository {
    
    constructor(
        @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
        @Inject(CONFIG_SERVICE) private readonly configService: IConfigService,
    ) {}

    async getArticle(cursor: number): Promise<Article[]> {
        const limit = this.configService.getArticlePageLimit();
        const queryBuilder = this.articleRepository.createQueryBuilder("article")
                                                    .leftJoinAndSelect("article.user", "user")
                                                    .leftJoinAndSelect("article.likes", "like")
                                                    .where("article.deletedAt IS NULL")
                                                    .orderBy("article.createdAt", "DESC");
        if (cursor) {
            queryBuilder.andWhere("article.id < :cursor", { cursor });
        }
    
        queryBuilder.take(limit);
    
        const alarms = await queryBuilder.getMany();
        return alarms;
    }

    async write(articleData: Article): Promise<number> {
        const storedArticle = await this.articleRepository.save(articleData);
        return storedArticle.id;
    }

    async update(articleData: UpdateArticle, articleId: number): Promise<void> {
        const {userId, ...data} = articleData;
        await this.articleRepository.update(articleId, data);
    }

    async remove(articleData: RemoveArticle): Promise<void> {
        await this.articleRepository.softRemove(articleData);
    }
    
    async findById(articleId: number): Promise<Article> {
        const article = await this.articleRepository.findOneBy({ id: articleId });
        this.ensureArticleExists(article);
        return article!;
    }
    
    async findOne(articleId: number): Promise<Article> {
        const article = await this.articleRepository
            .createQueryBuilder('article')
            .leftJoinAndSelect('article.user', 'user')
            .where('article.id = :id', { id: articleId })
            .getOne();
        
        this.ensureArticleExists(article);
        return article!;
    }

    private ensureArticleExists(article: Article | null) {
        if (!article) {
            throw new NotFoundException(ERROR_MESSAGES.ARTICLE_NOT_FOUND);
        }
    }
}