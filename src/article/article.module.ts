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
import { UserModule } from "src/user/user.module";
import { AppConfigModule } from "src/common/configs/config.module";

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
    ],
    controllers: [ArticleController],
    providers: [
        ArticleService,
        ArticleRepository,
        AttachUserInterceptor,
    ],
    exports: [
        ArticleRepository,
    ]
})

export class ArticleModule {}