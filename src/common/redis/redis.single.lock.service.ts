import { Injectable } from "@nestjs/common";
import { RedisConnectionService } from "./redis.connection.service";
import { ILockService } from "./cache.interface";
import { REDIS_LOCK_SUCCESS_RESPONSE, REDIS_LOCK_VALUE } from "src/like/like.util";

@Injectable()
export class SingleRedisLockService implements ILockService {

    constructor(
        private readonly redisConnectionService: RedisConnectionService,
    ) {}

    async acquire(key: string, ttl: number): Promise<boolean> {
        const redisClient = this.redisConnectionService.getClient();
        const setLockKeyInRedis = await redisClient.set(
                                                        key, 
                                                        REDIS_LOCK_VALUE, 
                                                        {
                                                            PX: ttl,
                                                            NX: true,
                                                        }
                                                    );
        return setLockKeyInRedis === REDIS_LOCK_SUCCESS_RESPONSE;
    }

    async release(key: string): Promise<void> {
        const redisClient = this.redisConnectionService.getClient();
        await redisClient.del(key);
    }
}