import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Like } from "src/entities/Like";
import { LikeController } from "./like.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "src/common/auth/auth.module";
import { UserModule } from "src/user/user.module";
import { ArticleModule } from "src/article/article.module";
import { LikeService } from "./like.service";
import { LikeRepository } from "./like.repository";
import { AppConfigModule } from "src/common/configs/config.module";

@Module({
    imports:[
        TypeOrmModule.forFeature([
            Like
        ]),
        AppConfigModule,
        JwtModule,
        ConfigModule,
        AuthModule,
        ArticleModule,
        UserModule,
    ],
    controllers:[
        LikeController,
    ],
    providers:[
        LikeService,
        LikeRepository
    ],
})

export class LikeModule {}