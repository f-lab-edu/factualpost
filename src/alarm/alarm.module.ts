import { Module } from "@nestjs/common";
import { AlarmController } from "./alarm.controller";
import { AlarmService } from "./alarm.service";
import { UserModule } from "src/user/user.module";
import { ArticleModule } from "src/article/article.module";
import { LikeModule } from "src/like/like.module";
import { AlarmTypeOrmRepository } from "./repositorys/alarm.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Alarm } from "src/entities/Alarm";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "src/common/auth/auth.module";
import { AppConfigModule } from "src/common/configs/config.module";
import { IALARM_REPOSITORY } from "./repositorys/alarm.interface";
import { SearchModule } from "src/common/search/search.module";

@Module({
    imports:[
        TypeOrmModule.forFeature([
            Alarm,
        ]),
        UserModule,
        ArticleModule,
        LikeModule,
        JwtModule,
        AuthModule,
        AppConfigModule,
        SearchModule,
    ],
    controllers:[
        AlarmController,
    ],
    providers:[
        AlarmService,
        {
            provide: IALARM_REPOSITORY,
            useClass: AlarmTypeOrmRepository
        }
    ],
})

export class AlarmModule {}