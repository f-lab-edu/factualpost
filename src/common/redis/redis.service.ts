import { Injectable } from "@nestjs/common";
import { RedisClientType } from "redis";
import { ICacheMemory } from "./cache.interface";
import { RedisConnectionService } from "./redis.connection.service";

@Injectable()
export class RedisService implements ICacheMemory {
    private redisClient: RedisClientType;

    constructor(
        private readonly redisConnectionService: RedisConnectionService,
    ) {
        this.redisClient = this.redisConnectionService.getClient();
    }

    async set(key: string, value: string): Promise<void> {
        await this.redisClient.set(key, value);
    }

    async get(key: string): Promise<string | null> {
        return await this.redisClient.get(key);
    }

    async remove(key: string): Promise<void> {
        await this.redisClient.del(key);
    }
}