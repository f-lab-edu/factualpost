import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { RedisClientType, createClient } from "redis";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisConnectionService implements OnModuleInit, OnModuleDestroy {
    private redisClient: RedisClientType;

    constructor(
        private readonly configService: ConfigService
    ) {
        const redisPort = this.configService.get<string>('REDIS_PORT_NUMBER') || '6379';
        this.redisClient = createClient({ url: `redis://localhost:${redisPort}` });
        this.redisClient.on('error', (err) => {
            console.log('Redis Connection Error : ', err.message);
        })
    }

    async onModuleInit() {
        try {
            await this.redisClient.connect();
            console.log('Redis Connection');
        } catch(err) {
            console.error('Redis Connection Fail', err.message);
            process.exit(1);
        }
    }

    async onModuleDestroy() {
        await this.redisClient.quit();
        console.log('Redis Connection Closed');
    }

    getClient(): RedisClientType {
        return this.redisClient;
    }
}