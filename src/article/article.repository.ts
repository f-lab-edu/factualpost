import { HttpException, Injectable } from "@nestjs/common";
import { CreateAritlce } from "./dtos/article.dto";
import { Article } from "src/entities/Article";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ArticleRepository {
    
    constructor(
        @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
        private readonly dataSource: DataSource,
    ) {}

    async write(articleData: CreateAritlce): Promise<number> {
        const storedArticle = await this.articleRepository.save(articleData);
        return storedArticle.id;
    }

    async remove(id: number): Promise<void> {
        const article = await this.dataSource.getRepository(Article).findOne({
            where: { id }
        })

        if(article) {
            await this.articleRepository.softRemove(article);
        }
    }

    async findById(articleId: number): Promise<number> {
        const article = await this.articleRepository.findOneBy({ id: articleId });
        if(!article) {
            throw new HttpException('not found article', 404);
        }
        return article.userId;
    }

}