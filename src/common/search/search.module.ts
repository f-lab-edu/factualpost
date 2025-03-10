import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Alarm } from "src/entities/Alarm";
import { Article } from "src/entities/Article";
import { ArticleSearch } from "./article.search.service";
import { AlarmSearch } from "./alarm.search.service";
import { SearchService } from "./search.service";
import { SearchStrategyFactory } from "./search.stratey";

@Module({
    imports:[
        TypeOrmModule.forFeature([
                    Article,
                    Alarm,
                ]),
    ],
    providers:[
        ArticleSearch,
        AlarmSearch,
        SearchService,
        SearchStrategyFactory,
    ],
    exports: [
        SearchService
    ]
})
export class SearchModule {}