import { Injectable } from "@nestjs/common";
import { RedisClientType } from "redis";
import { ICacheMemory } from "./cache.interface";
import { RedisConnectionService } from "./redis.connection.service";
import { LikeRedisKeyAndValue } from "src/types";

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

    async remove(key: string): Promise<void> {
        await this.redisClient.del(key);
    }

    async increment(key: string): Promise<void> {
        await this.redisClient.incr(key);
    }

    async decrement(key: string): Promise<void> {
        await this.redisClient.decr(key);
    }

    async sAdd(key: string, member: string): Promise<void> {
        await this.redisClient.sAdd(key, member);
    }
    async sMembers(key: string): Promise<string[]> {
        return await this.redisClient.sMembers(key);
    }

    async renameKey(oldKey: string, newKey: string): Promise<void> {
        await this.redisClient.rename(oldKey, newKey);
    }

    async getKeysAndLikeCount(keys: string[]): Promise<LikeRedisKeyAndValue> {
        const results = await this.executeRedisPipeline(keys);
        return this.processPipelineResults(keys, results);
    }

    async executeRedisPipeline(keys: string[]): Promise<any[]> {
        const pipeline = this.redisClient.multi();
        keys.forEach(key => {
            pipeline.exists(key);
            pipeline.get(key);
            pipeline.del(key);
        });
    
        return await pipeline.exec();
    }

    private processPipelineResults(keys: string[], results: any[]): LikeRedisKeyAndValue {
        const response: LikeRedisKeyAndValue = {};
    
        for (const [index, key] of keys.entries()) {
            const { existsResult, getResult } = this.extractKeyResults(results, index);
            const value = this.resolveRedisValue(existsResult, getResult);
            
            if (value !== null) {
                response[key] = value;
            }
        }
    
        return response;
    }
    
    private extractKeyResults(results: any[], keyIndex: number) {
        const resultIndex = keyIndex * 3;
        return {
            existsResult: results[resultIndex],
            getResult: results[resultIndex + 1],
        };
    }

    private resolveRedisValue(existsResult: any, getResult: any): string | null {
        const isExists = existsResult === 1;
        const isValidType = typeof getResult === 'string';
        
        return isExists && isValidType 
            ? getResult 
            : null;
    }
}