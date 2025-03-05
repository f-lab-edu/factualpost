import { RemoveArticle, UpdateArticle } from "src/article/dtos/article.dto"
import { Article } from "src/entities/Article"

export const IARTICLE_REPOSITORY = "IARTICLE_REPOSITORY";

export interface IArticleRepository {
    getArticle(cursor: number): Promise<Article[]>
    write(articleData: Article): Promise<number>
    update(articleData: UpdateArticle, articleId: number): Promise<void>
    remove(articleData: RemoveArticle): Promise<void>
    findById(articleId: number): Promise<Article>
    findOne(articleId: number): Promise<Article>
}