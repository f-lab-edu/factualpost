import { Injectable } from "@nestjs/common";
import { SearchData, SortOrder } from "src/alarm/dtos/alarm.dto";
import { SearchStrategy } from "src/common/search/interface/search.interface";
import { Alarm } from "src/entities/Alarm";
import { SelectQueryBuilder } from "typeorm";

@Injectable()
export class AlarmSearch implements SearchStrategy<Alarm> {
    applyFilters(queryBuilder: SelectQueryBuilder<Alarm>, searchData: any, cursor?: number): void {
        if (searchData.type) {
            queryBuilder.andWhere("alarm.type = :type", { type: searchData.type });
        }
    
        if (searchData.keyword) {
            queryBuilder.andWhere("alarm.message LIKE :keyword", { keyword: `%${searchData.keyword}%` });
        }
    
        if (searchData.startDate) {
            queryBuilder.andWhere("alarm.createdAt >= :startDate", { startDate: searchData.startDate });
        }
    
        if (searchData.endDate) {
            queryBuilder.andWhere("alarm.createdAt <= :endDate", { endDate: searchData.endDate });
        }

        if (cursor) {
            queryBuilder.andWhere("alarm.id < :cursor", { cursor });
        }
    }

    applySorting(queryBuilder: SelectQueryBuilder<Alarm>, searchData: SearchData): void {
        const order = searchData.sortOrder || SortOrder.DESC;
        queryBuilder.orderBy("alarm.createdAt", order);
    }
}