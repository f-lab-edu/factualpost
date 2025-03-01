import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ValidatorModule } from './common/validators/validator.module';
import { RedisModule } from './common/redis/redis.module';
import { AuthModule } from './common/auth/auth.module';
import { DatabaseService } from './common/database/database.service';
import { ArticleModule } from './article/article.module';
import { getDatabaseConfig } from './common/configs/database.config';
import userConfig from './common/configs/user.config';
import { LikeModule } from './like/like.module';
import { AppConfigModule } from './common/configs/config.module';
import { EncryptModule } from './user/encrypts/encrypt.module';
import { AlarmModule } from './alarm/alarm.module';

@Module({
    imports: [
        ConfigModule.forRoot({ 
            isGlobal: true,
            load: [ userConfig ],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getDatabaseConfig,
        }),
        AppConfigModule,
        AuthModule,
        UserModule,
        ValidatorModule,
        RedisModule,
        ArticleModule,
        LikeModule,
        EncryptModule,
        AlarmModule,
    ],
    providers: [
        DatabaseService
    ],
})
export class AppModule {}
