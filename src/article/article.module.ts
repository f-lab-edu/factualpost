import { Module } from "@nestjs/common";
import { ArticleController } from "./article.controller";
import { ArticleService } from "./article.service";
import { ArticleRepository } from "./article.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/common/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Article } from "src/entities/Article";
import { AttachUserInterceptor } from "src/common/interceptor/attach.user.interceptor";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Article
        ]),
        AuthModule,
        ConfigModule,
        JwtModule
    ],
    controllers: [ArticleController],
    providers: [
        ArticleService,
        ArticleRepository,
        AttachUserInterceptor,
    ],
    exports: []
})

export class ArticleModule {}