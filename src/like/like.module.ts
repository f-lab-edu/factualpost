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
import { LikeTypeOrmRepository } from "./repositorys/like.repository";
import { AppConfigModule } from "src/common/configs/config.module";
import { ILIKE_REPOSITORY } from "./repositorys/interface/like.interface";
import { Users } from "src/entities/Users";
import { RedisModule } from "src/common/redis/redis.module";
import { BullModule } from "@nestjs/bull";
import { LikeProcessor } from "./like.processor";
import { ScheduleModule } from "@nestjs/schedule";
import { LikeCountService } from "./like.count.service";
import { LIKE_QUEUE_NAME } from "./like.util";

@Module({
    imports:[
        TypeOrmModule.forFeature([
            Like,
            Users
        ]),
        BullModule.registerQueue({
            name: LIKE_QUEUE_NAME
        }),
        ScheduleModule.forRoot(),
        AppConfigModule,
        JwtModule,
        ConfigModule,
        AuthModule,
        ArticleModule,
        UserModule,
        RedisModule,
    ],
    controllers:[
        LikeController,
    ],
    providers:[
        LikeService,
        {
            provide: ILIKE_REPOSITORY,
            useClass: LikeTypeOrmRepository,
        },
        LikeProcessor,
        LikeCountService,
    ],
    exports:[
        ILIKE_REPOSITORY
    ]
})

export class LikeModule {}