import { Injectable } from "@nestjs/common";
import { SearchAlarmData, SortOrder } from "src/alarm/dtos/alarm.dto";
import { SearchStrategy } from "src/common/search/interface/search.interface";
import { Alarm } from "src/entities/Alarm";
import { SelectQueryBuilder } from "typeorm";

@Injectable()
export class AlarmSearch implements SearchStrategy<Alarm> {
    applyFilters(queryBuilder: SelectQueryBuilder<Alarm>, searchQuery: SearchAlarmData): void {
        if (searchQuery.type) {
            queryBuilder.andWhere("alarm.type = :type", { type: searchQuery.type });
        }
    
        if (searchQuery.keyword) {
            queryBuilder.andWhere("alarm.message LIKE :keyword", { keyword: `%${searchQuery.keyword}%` });
        }
    
        if (searchQuery.startDate) {
            queryBuilder.andWhere("alarm.createdAt >= :startDate", { startDate: searchQuery.startDate });
        }
    
        if (searchQuery.endDate) {
            queryBuilder.andWhere("alarm.createdAt <= :endDate", { endDate: searchQuery.endDate });
        }

        if (searchQuery.cursor) {
            queryBuilder.andWhere("alarm.id < :cursor", { cursor: searchQuery.cursor });
        }
    }

    applySorting(queryBuilder: SelectQueryBuilder<Alarm>, searchQuery: SearchAlarmData): void {
        const order = searchQuery.sortOrder || SortOrder.DESC;
        queryBuilder.orderBy("alarm.createdAt", order);
    }
}