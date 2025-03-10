import { Injectable } from "@nestjs/common";
import { ArticleSearch } from "src/common/search/article.search.service";
import { SearchStrategy } from "./interface/search.interface";
import { AlarmSearch } from "./alarm.search.service";

@Injectable()
export class SearchStrategyFactory {
    constructor(
        private readonly articleSearch: ArticleSearch,
        private readonly alarmSearch: AlarmSearch,
    ) {}

    getStrategy(entityType: string): SearchStrategy<any> {
        switch (entityType) {
            case 'article':
                return this.articleSearch;
            case 'alarm':
                return this.alarmSearch;
            default:
                throw new Error(`No Strategy found for entity type: ${entityType}`);
        }
    }

}