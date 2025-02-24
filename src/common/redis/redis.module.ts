import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { RedisConnectionService } from "./redis.connection.service";

@Module({
    providers: [RedisConnectionService,RedisService],
    exports: [RedisService],
})
export class RedisModule {}