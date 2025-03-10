import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { RemoveArticle, SearchArticleData, UpdateArticle } from "../dtos/article.dto";
import { Article } from "src/entities/Article";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { CONFIG_SERVICE, IConfigService } from "src/common/configs/config.interface.service";
import { IArticleRepository } from "./interface/article.interface";
import { SearchService } from "src/common/search/search.service";

@Injectable()
export class ArticleTypeOrmRepository implements IArticleRepository{
    
    constructor(
        @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
        @Inject(CONFIG_SERVICE) private readonly configService: IConfigService,
        private readonly searchService: SearchService,
    ) {}

    async getArticles(searchQuery: SearchArticleData): Promise<Article[]> {
        const limit = this.configService.getArticlePageLimit();
        const queryBuilder = this.articleRepository
                                .createQueryBuilder("article")
                                .leftJoinAndSelect("article.user", "user")
                                .leftJoinAndSelect("article.likes", "like")
                                .where("article.deletedAt IS NULL");
        this.searchService.applyFilter("article", queryBuilder, searchQuery);
        this.searchService.applySorting("article", queryBuilder, searchQuery);
        queryBuilder.take(limit);
    
        return queryBuilder.getMany();
    }
        
    async getArticle(articleId: number): Promise<Article> {
        const article = await this.articleRepository
                                    .createQueryBuilder('article')
                                    .leftJoinAndSelect('article.likes', 'like')
                                    .select([
                                        'article.id AS article_id',
                                        'article.title AS article_title',
                                        'article.contents AS article_contents',
                                        'COUNT(like.id) AS like_count'
                                    ])
                                    .where('article.id = :articleId', { articleId })
                                    .groupBy('article.id')
                                    .getRawOne();
    
        return article;
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