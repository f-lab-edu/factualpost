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
        AuthModule,
        UserModule,
        ValidatorModule,
        RedisModule,
        ArticleModule
    ],
    providers: [
        DatabaseService
    ],
})
export class AppModule {}
