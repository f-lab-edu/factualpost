import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateArticle, UpdateArticle } from "./dtos/article.dto";
import { ArticleRepository } from "./article.repository";
import { UserRepository } from "src/user/user.repository";
import { Article } from "src/entities/Article";

@Injectable()
export class ArticleService {
    constructor(
        private readonly articleRepository: ArticleRepository,
        private readonly userRepository: UserRepository,
    ){}

    async write(articleData: CreateArticle): Promise<number> {
        const user = await this.userRepository.findByPk(articleData.userId);
        if (!user) {
            throw new Error('User not found');
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
            throw new UnauthorizedException();
        }
        await this.articleRepository.update(articleData, articleId);
    }

    async remove(userId: number, articleId: number) {
        const article = await this.articleRepository.findById(articleId);
        if(article.user.id !== userId) {
            throw new UnauthorizedException();
        }
        await this.articleRepository.remove(article);
    }

}