import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateArticle, UpdateArticle } from "./dtos/article.dto";
import { ArticleRepository } from "./article.repository";
import { UserRepository } from "src/user/user.repository";
import { Article } from "src/entities/Article";
import { ERROR_MESSAGES } from "src/common/constants/error-message";

@Injectable()
export class ArticleService {
    constructor(
        private readonly articleRepository: ArticleRepository,
        private readonly userRepository: UserRepository,
    ){}

    async write(articleData: CreateArticle): Promise<number> {
        const user = await this.userRepository.findById(articleData.userId);
        if (!user) {
            throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
        }
        const article = new Article();
        article.title = articleData.title;
        article.contents = articleData.contents;
        article.user = user;
        return await this.articleRepository.write(article);
    }

    async update(articleData: UpdateArticle, articleId: number): Promise<void> {
        const article = await this.articleRepository.findById(articleId);
        if(article.user.id !== articleData.userId) {
            throw new ForbiddenException(ERROR_MESSAGES.UNAUTHORIZED_UPDATE);
        }
        await this.articleRepository.update(articleData, articleId);
    }

    async remove(userId: number, articleId: number) {
        const article = await this.articleRepository.findById(articleId);
        if(article?.user?.id !== userId) {
            throw new ForbiddenException(ERROR_MESSAGES.UNAUTHORIZED_DELETE);
        }
        await this.articleRepository.remove(article);
    }

}