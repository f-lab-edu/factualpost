import { Injectable } from "@nestjs/common";
import { SearchStrategyFactory } from "./search.stratey";
import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

@Injectable()
export class SearchService {
    constructor(
        private readonly strategyFactory: SearchStrategyFactory
    ) {}

    applyFilter<T extends ObjectLiteral>(
        entityType: string,
        queryBuilder: SelectQueryBuilder<T>,
        searchData: any,
    ): void {
        const strategy = this.strategyFactory.getStrategy(entityType);
        strategy.applyFilters(queryBuilder, searchData);
    }

    applySorting<T extends ObjectLiteral>(
        entityType: string, 
        queryBuilder: SelectQueryBuilder<T>, 
        searchData: any
    ): void {
        const strategy = this.strategyFactory.getStrategy(entityType);
        strategy.applySorting(queryBuilder, searchData);
    }

}