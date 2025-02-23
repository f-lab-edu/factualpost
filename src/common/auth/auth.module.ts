import { Module } from "@nestjs/common";
import { AuthService } from "./service/auth.service";
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from "src/common/redis/redis.module";
import { JwtAuthGuard } from "./auth.guard";
import { JwtInterceptor } from "./auth.interceptor";
import { AuthCacheService } from "./service/auth.cache.service";
import { AuthTokenService } from "./service/auth.token.service";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
        }),
        RedisModule,
    ],
    providers: [
        AuthService,
        AuthCacheService,
        AuthTokenService,
        JwtAuthGuard,
        JwtInterceptor,
    ],
    exports: [
        AuthService,
        JwtAuthGuard,
    ]
})

export class AuthModule {}