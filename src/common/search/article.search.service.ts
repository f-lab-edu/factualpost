import { Injectable } from "@nestjs/common";
import { SearchArticleData, SortOrder } from "src/article/dtos/article.dto";
import { SearchStrategy } from "src/common/search/interface/search.interface";
import { Article } from "src/entities/Article";
import { SelectQueryBuilder } from "typeorm";

@Injectable()
export class ArticleSearch implements SearchStrategy<Article> {
    applyFilters(queryBuilder: SelectQueryBuilder<Article>, searchData: any, cursor?: number): void {
        if (searchData.keyword) {
            queryBuilder.andWhere("article.title LIKE :title", { title: `%${searchData.keyword}%` });
        }

        if (searchData.startDate) {
            queryBuilder.andWhere("article.createdAt >= :startDate", { startDate: searchData.startDate });
        }

        if (searchData.endDate) {
            queryBuilder.andWhere("article.createdAt <= :endDate", { endDate: searchData.endDate });
        }

        if (cursor) {
            queryBuilder.andWhere("article.id < :cursor", { cursor });
        }
    }

    applySorting(queryBuilder: SelectQueryBuilder<Article>, searchData: SearchArticleData): void {
        const order = searchData.sortOrder || SortOrder.DESC;
        queryBuilder.orderBy("article.createdAt", order);
    }
}