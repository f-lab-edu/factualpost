import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { CreateArticle, SearchArticleData, UpdateArticle } from "./dtos/article.dto";
import { Article, SaveArticle } from "./article.type";
import { ArticleMeta } from "src/entities/article-meta";
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { Users } from "src/entities/Users";
import { IUSER_REPOSITORY, IUserRepository } from "src/user/repositorys/interface/user.repository.interface";
import { IARTICLE_REPOSITORY, IArticleRepository } from "./repositorys/interface/article.interface";
import { ArticleContents } from "src/entities/article-contents";

@Injectable()
export class ArticleService {
    constructor(
        @Inject(IARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
        @Inject(IUSER_REPOSITORY) private readonly userRepository: IUserRepository,
    ) {}

    async getArticles(searchQuery: SearchArticleData): Promise<ArticleMeta[]> {
        return await this.articleRepository.getArticles(searchQuery);
    }

    async getArticle(articleId: number): Promise<Article> {
        return await this.articleRepository.getArticle(articleId);
    }

    async write(articleData: CreateArticle): Promise<number> {
        const user = await this.userRepository.findById(articleData.userId);
        const saveArticle = this.createArticleEntity(articleData, user);
        return await this.articleRepository.write(saveArticle);
    }

    async update(articleData: UpdateArticle, articleId: number): Promise<void> {
        const articleWithContents = await this.articleRepository.findOne(articleId);
        this.validateOwnerShip(articleWithContents.userId, articleData.userId, ERROR_MESSAGES.UNAUTHORIZED_UPDATE);
        await this.articleRepository.update(articleData, articleId);
    }

    async remove(userId: number, articleId: number) {
        const article = await this.articleRepository.findById(articleId);
        this.validateOwnerShip(article?.userId, userId, ERROR_MESSAGES.UNAUTHORIZED_DELETE);
        await this.articleRepository.remove(article);
    }

    private validateOwnerShip(ownerId: number, requesterId: number, errorMessage: string) {
        if(ownerId !== requesterId) {
            throw new ForbiddenException(errorMessage);
        }
    }

    private createArticleEntity(articleData: CreateArticle, user: Users): SaveArticle {
        const articleMeta = new ArticleMeta();
        const articleContents = new ArticleContents();
        articleMeta.title = articleData.title;
        articleMeta.user = user;
        articleContents.contents = articleData.contents;
        return {articleMeta, articleContents};
    }
}