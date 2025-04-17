import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { RedisConnectionService } from "./redis.connection.service";
import { CACHE_MEMORY_SERVICE, ILOCK_SERVICE } from "./cache.interface";
import { SingleRedisLockService } from "./redis.single.lock.service";
import { RedlockManagerService } from "./redis.lock.service";

@Module({
    providers: [
        RedisConnectionService,
        RedlockManagerService,
        {
            provide: CACHE_MEMORY_SERVICE,
            useClass: RedisService,
        },
        {
            provide: ILOCK_SERVICE,
            useClass: SingleRedisLockService,
        }
    ],
    exports: [
        CACHE_MEMORY_SERVICE,
        ILOCK_SERVICE
    ],
})
export class RedisModule {}