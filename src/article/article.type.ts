import { ArticleContents } from "src/entities/article-contents";
import { ArticleMeta } from "src/entities/article-meta";
import { Users } from "src/entities/Users";

export interface Article {
    id: number;
    title: string;
    likeCount: number;
    user: Users;
    contents: string;
}

export interface SaveArticle {
    articleMeta: ArticleMeta;
    articleContents: ArticleContents;
}

export interface ArticleWithContents extends ArticleMeta {
    contents: string;
}
