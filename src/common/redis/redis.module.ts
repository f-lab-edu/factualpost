import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { RedisConnectionService } from "./redis.connection.service";
import { CACHE_MEMORY_SERVICE } from "./cache.interface";

@Module({
    providers: [
        RedisConnectionService,
        {
            provide: CACHE_MEMORY_SERVICE,
            useClass: RedisService,
        }
    ],
    exports: [
        CACHE_MEMORY_SERVICE
    ],
})
export class RedisModule {}