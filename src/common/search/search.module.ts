import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Alarm } from "src/entities/Alarm";
//import { Article } from "src/entities/Article";
import { ArticleMeta } from "src/entities/article-meta";
import { ArticleSearch } from "./article.search.service";
import { AlarmSearch } from "./alarm.search.service";
import { SearchService } from "./search.service";
import { SearchStrategyFactory } from "./search.stratey";

@Module({
    imports:[
        TypeOrmModule.forFeature([
                    ArticleMeta,
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