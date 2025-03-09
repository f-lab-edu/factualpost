import { Module } from "@nestjs/common";
import { ArticleController } from "./article.controller";
import { ArticleService } from "./article.service";
import { ArticleTypeOrmRepository } from "./repositorys/article.typeorm.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/common/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Article } from "src/entities/Article";
import { UserModule } from "src/user/user.module";
import { AppConfigModule } from "src/common/configs/config.module";
import { IARTICLE_REPOSITORY } from "./repositorys/interface/article.interface";
import { SearchModule } from "src/common/search/search.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Article
        ]),
        AppConfigModule,
        AuthModule,
        ConfigModule,
        JwtModule,
        UserModule,
        SearchModule,
    ],
    controllers: [ArticleController],
    providers: [
        ArticleService,
        {
            provide: IARTICLE_REPOSITORY,
            useClass: ArticleTypeOrmRepository
        },
        
    ],
    exports: [
        IARTICLE_REPOSITORY,
    ]
})

export class ArticleModule {}