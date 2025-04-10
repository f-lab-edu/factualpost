import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Alarm } from "src/entities/Alarm";
import { ArticleContents } from "src/entities/article-contents";
import { ArticleMeta } from "src/entities/article-meta";
import { Like } from "src/entities/Like";
import { Users } from "src/entities/Users";

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT') || 3306,
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    entities:[
        Users,
        Like,
        Alarm,
        ArticleMeta,
        ArticleContents
    ],
    synchronize: false,
    logging: false
})