import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { CreateArticle, UpdateArticle } from "./dtos/article.dto";
import { Article } from "src/entities/Article";
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { Users } from "src/entities/Users";
import { IUSER_REPOSITORY, IUserRepository } from "src/user/repositorys/interface/user.repository.interface";
import { IARTICLE_REPOSITORY, IArticleRepository } from "./repositorys/interface/article.interface";

@Injectable()
export class ArticleService {
    constructor(
        @Inject(IARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
        @Inject(IUSER_REPOSITORY) private readonly userRepository: IUserRepository,
    ){}

    async getArticle(cursor: number): Promise<Article[]> {
        return await this.articleRepository.getArticle(cursor);
    }

    async write(articleData: CreateArticle): Promise<number> {
        const user = await this.userRepository.findById(articleData.userId);
        const article = this.createArticleEntity(articleData, user);
        return await this.articleRepository.write(article);
    }

    async update(articleData: UpdateArticle, articleId: number): Promise<void> {
        const article = await this.articleRepository.findById(articleId);
        this.validateOwnerShip(article.user.id, articleData.userId, ERROR_MESSAGES.UNAUTHORIZED_UPDATE);
        await this.articleRepository.update(articleData, articleId);
    }

    async remove(userId: number, articleId: number) {
        const article = await this.articleRepository.findById(articleId);
        this.validateOwnerShip(article?.user?.id, userId, ERROR_MESSAGES.UNAUTHORIZED_DELETE);
        await this.articleRepository.remove(article);
    }

    private validateOwnerShip(ownerId: number, requesterId: number, errorMessage: string) {
        if(ownerId !== requesterId) {
            throw new ForbiddenException(errorMessage);
        }
    }

    private createArticleEntity(articleData: CreateArticle, user: Users): Article {
        const article = new Article();
        article.title = articleData.title;
        article.contents = articleData.contents;
        article.user = user;
        return article;
    }

}