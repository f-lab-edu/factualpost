import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { RemoveArticle, UpdateArticle } from "./dtos/article.dto";
import { Article } from "src/entities/Article";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ArticleRepository {
    
    constructor(
        @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
    ) {}

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
        if(!article) {
            throw new HttpException('not found article', 404);
        }
        return article;
    }
}