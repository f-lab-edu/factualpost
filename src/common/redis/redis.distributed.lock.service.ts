import { Injectable, OnModuleInit } from "@nestjs/common";
import type { Lock } from "redlock";
import { ILockService } from "./cache.interface";
import { RedlockManagerService } from "./redis.lock.service";

@Injectable()
export class CacheLockService implements ILockService {

    constructor(
        private readonly redlockManage: RedlockManagerService
    ) {}

    async acquire(key: string, ttl: number): Promise<Lock> {
        return await this.redlockManage.getInstance().acquire([key], ttl);
    }

    async release(lock: Lock): Promise<void> {
        await lock.release();
    }
}
