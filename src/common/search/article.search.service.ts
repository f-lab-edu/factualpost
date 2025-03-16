import { Injectable } from "@nestjs/common";
import { SearchArticleData, SortOrder } from "src/article/dtos/article.dto";
import { SearchStrategy } from "src/common/search/interface/search.interface";
//import { Article } from "src/entities/Article";
import { ArticleMeta } from "src/entities/article-meta";
import { SelectQueryBuilder } from "typeorm";

@Injectable()
export class ArticleSearch implements SearchStrategy<ArticleMeta> {
    applyFilters(queryBuilder: SelectQueryBuilder<ArticleMeta>, searchQuery: SearchArticleData): void {
        if (searchQuery.keyword) {
            queryBuilder.andWhere("article.title LIKE :title", { title: `%${searchQuery.keyword}%` });
        }

        if (searchQuery.startDate) {
            queryBuilder.andWhere("article.createdAt >= :startDate", { startDate: searchQuery.startDate });
        }

        if (searchQuery.endDate) {
            queryBuilder.andWhere("article.createdAt <= :endDate", { endDate: searchQuery.endDate });
        }

        if (searchQuery.cursor) {
            queryBuilder.andWhere("article.id > :cursor", { cursor: searchQuery.cursor });
        }
    }

    applySorting(queryBuilder: SelectQueryBuilder<ArticleMeta>, searchQuery: SearchArticleData): void {
        const order = searchQuery.sortOrder || SortOrder.DESC;
        queryBuilder.orderBy("article.createdAt", order);
    }
}