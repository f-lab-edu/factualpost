import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export interface SearchStrategy<T extends ObjectLiteral> {
    applyFilters(queryBuilder: SelectQueryBuilder<T>, searchData: any, cursor?: number): void;
    applySorting(queryBuilder: SelectQueryBuilder<T>, searchData: any): void;
}
