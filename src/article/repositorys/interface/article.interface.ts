import { RemoveArticle, SearchArticleData, UpdateArticle } from "src/article/dtos/article.dto"
import { ArticleMeta } from "src/entities/article-meta";
import { Article, ArticleWithContents, SaveArticle } from "src/article/article.type";

export const IARTICLE_REPOSITORY = "IARTICLE_REPOSITORY";

export interface IArticleRepository {
    getArticles(searchQuery: SearchArticleData): Promise<ArticleMeta[]>
    getArticle(articleId: number): Promise<Article>
    write(articleData: SaveArticle): Promise<number>
    update(articleData: UpdateArticle, articleId: number): Promise<void>
    remove(articleData: RemoveArticle): Promise<void>
    findById(articleId: number): Promise<ArticleMeta>
    findOne(articleId: number): Promise<ArticleWithContents>
    updateLikeCount(storedLike: number, redisLike: number, articleId: number): Promise<void>
}