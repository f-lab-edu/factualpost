import { Injectable } from "@nestjs/common";
import Redlock from "redlock";
import { RedisConnectionService } from "./redis.connection.service";
import { REDLOCK_EVENT_CLIENT_ERROR, REDLOCK_RETRY_COUNT, REDLOCK_RETRY_DELAY } from "src/like/like.util";

@Injectable()
export class RedlockManagerService {

    private readonly redlock: Redlock;

    constructor(
        private readonly redisConnectionService: RedisConnectionService
    ) {
        const redisClient = this.redisConnectionService.getClient();

        this.redlock = new Redlock([redisClient as any], {
            retryCount: REDLOCK_RETRY_COUNT,
            retryDelay: REDLOCK_RETRY_DELAY,
        });

        this.redlock.on(REDLOCK_EVENT_CLIENT_ERROR, (err) => {
            console.error("Redlock Client Error:", err.message);
        })
    }

    getInstance(): Redlock {
        return this.redlock;
    }

}