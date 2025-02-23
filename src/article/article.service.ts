import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateAritlce } from "./dtos/article.dto";
import { ArticleRepository } from "./article.repository";

@Injectable()
export class ArticleService {
    constructor(
        private readonly articleRepository: ArticleRepository,
    ){}

    async write(articleData: CreateAritlce): Promise<number> {
        return await this.articleRepository.write(articleData);
    }

    async remove(userId: number, articleId: number) {
        const writerId = await this.articleRepository.findById(articleId);
        if(writerId !== userId) {
            throw new UnauthorizedException();
        }
        await this.articleRepository.remove(articleId);
    }

}