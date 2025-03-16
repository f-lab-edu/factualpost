import { Injectable } from "@nestjs/common";
import { RedisClientType } from "redis";
import { ICacheMemory } from "./cache.interface";
import { RedisConnectionService } from "./redis.connection.service";

@Injectable()
export class RedisService implements ICacheMemory{
    private redisClient: RedisClientType;

    constructor(
        private readonly redisConnectionService: RedisConnectionService,
    ) {
        this.redisClient = this.redisConnectionService.getClient();
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        await this.redisClient.set(key, value, { EX: ttl });
    }

    async get(key: string): Promise<string | null> {
        return await this.redisClient.get(key);
    }

    async getKeys(pattern: string): Promise<string[]> {
        return await this.redisClient.keys(pattern);
    }

    async getAndRemove(key: string): Promise<string | null> {
        const script = `
            local value = redis.call("GET", KEYS[1])
            if value then
                redis.call("DEL", KEYS[1])
            end
            return value
        `;
        const result = await this.redisClient.eval(script, {keys: [key]});
        return result ? String(result) : null;
    }

    async remove(key: string): Promise<void> {
        await this.redisClient.del(key);
    }

    async increment(key: string): Promise<void> {
        await this.redisClient.incr(key);
    }

    async decrement(key: string): Promise<void> {
        await this.redisClient.decr(key);
    }
}