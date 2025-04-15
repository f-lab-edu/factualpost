import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { RemoveArticle, SearchArticleData, UpdateArticle } from "../dtos/article.dto";
import { Article, ArticleWithContents, SaveArticle } from "../article.type";
import { ArticleMeta } from "src/entities/article-meta";
import { Repository, DataSource } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { CONFIG_SERVICE, IConfigService } from "src/common/configs/config.interface.service";
import { IArticleRepository } from "./interface/article.interface";
import { SearchService } from "src/common/search/search.service";
import { ArticleContents } from "src/entities/article-contents";
import { CACHE_MEMORY_SERVICE, ICacheMemory } from "src/common/redis/cache.interface";
import { UpdateLikeCount } from "src/types";

interface BulkUpdateParams {
    cases: string;
    parameters: number[];
    ids: number[];
}

@Injectable()
export class ArticleTypeOrmRepository implements IArticleRepository{
    
    constructor(
        @InjectRepository(ArticleMeta) private readonly articleRepository: Repository<ArticleMeta>,
        @InjectRepository(ArticleContents) private readonly articleContentsRepository: Repository<ArticleContents>,
        @Inject(CONFIG_SERVICE) private readonly configService: IConfigService,
        @Inject(CACHE_MEMORY_SERVICE) private readonly cacheService: ICacheMemory,
        private readonly searchService: SearchService,
        @Inject(DataSource) private readonly dataSource: DataSource,
    ) {}

    async getArticles(searchQuery: SearchArticleData): Promise<ArticleMeta[]> {
        const limit = this.configService.getArticlePageLimit();
        const articlesCacheKey = `articles:${JSON.stringify(searchQuery)}`;
        const articlesInCacheMemory = await this.cacheService.get(articlesCacheKey);

        if(articlesInCacheMemory) {
            return JSON.parse(articlesInCacheMemory);
        }

        const queryBuilder = this.articleRepository
                                .createQueryBuilder('article')
                                .leftJoinAndSelect('article.user', 'user')
                                .select([
                                    'article.id',
                                    'article.title',
                                    'article.likeCount',
                                    'article.updatedAt',
                                    'user.userId',
                                ]);
        this.searchService.applyFilter('article', queryBuilder, searchQuery);
        this.searchService.applySorting('article', queryBuilder, searchQuery);
        queryBuilder.limit(limit);

        const articles = await queryBuilder.getMany();
        await this.cacheService.set(
                                    articlesCacheKey, 
                                    JSON.stringify(articles), 
                                    this.configService.getArticleCacheTTL()
                                );

        return articles;
    }
    
    async getArticle(articleId: number): Promise<Article> {
        const article = await this.articleRepository
                                .createQueryBuilder('article')
                                .leftJoinAndSelect('article.user', 'user')
                                .leftJoinAndSelect('article_contents', 'contents', 'contents.articleId = article.id')
                                .select([
                                    'article.id',
                                    'article.title',
                                    'article.likeCount',
                                    'article.updatedAt',
                                    'user.userId',
                                    'contents.contents',
                                ])
                                .where('article.id = :articleId', { articleId })
                                .getRawOne();
        this.ensureArticleExists(article);
        return article;
    }

    async write(saveArticle: SaveArticle): Promise<number> {
        const storedArticle = await this.articleRepository.save(saveArticle.articleMeta);
        saveArticle.articleContents.articleId = storedArticle.id;
        await this.articleContentsRepository.save(saveArticle.articleContents);
        return storedArticle.id;
    }

    async update(articleData: UpdateArticle, articleId: number): Promise<void> {
        await this.articleRepository.update(articleId, { title: articleData.title});
        await this.articleContentsRepository.update(articleId, { contents: articleData.contents});
    }
    
    async updateLikeCount(storedLike: number, redisLike: number, articleId: number) {
        const likeCount = storedLike + redisLike;
        await this.articleRepository.update(articleId, {likeCount: likeCount});
    }

    async remove(articleData: RemoveArticle): Promise<void> {
        await this.articleRepository.softRemove(articleData);
    }
    
    async findById(articleId: number): Promise<ArticleMeta> {
        const article = await this.articleRepository.findOneBy({ id: articleId });
        this.ensureArticleExists(article);
        return article!;
    }

    async findContentsById(articleId: number): Promise<ArticleContents> {
        const articleContents = await this.articleContentsRepository.findOneBy({ articleId: articleId });
        return articleContents!;
    }
    
    async findOne(articleId: number): Promise<ArticleWithContents> {
        const article = await this.findById(articleId);
        const articleContents = await this.findContentsById(articleId);
        return {
            ...article,
            contents: articleContents.contents,
        };
    }

    private ensureArticleExists(article: ArticleMeta | null) {
        if (!article) {
            throw new NotFoundException(ERROR_MESSAGES.ARTICLE_NOT_FOUND);
        }
    }

    async bulkUpdateLikeCount(updates: UpdateLikeCount[]): Promise<void> {
        if (updates.length === 0) return;

        const { cases, parameters, ids } = this.buildLikeCountCases(updates);
        const idPlaceholders = ids.map(() => '?').join(', ');
        const query = `
                UPDATE article_meta
                SET likeCount = CASE
                    ${cases}
                ELSE likeCount
                END
                WHERE id IN(${idPlaceholders})            
        `;
        await this.dataSource.query(query, [...parameters, ...ids]);
    }

    private buildLikeCountCases(updates: UpdateLikeCount[]): BulkUpdateParams {
        const cases = updates
                        .map(() => `WHEN id = ? THEN likeCount + ?`)
                        .join('\n');
        const parameters = updates.flatMap(u => [u.articleId, u.likeCount]);
        const ids = updates.map(u => u.articleId);
        return { cases, parameters, ids };
    }
    
}