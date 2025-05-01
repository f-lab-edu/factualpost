export const CACHE_MEMORY_SERVICE = 'CACHE_MEMORY_SERVICE';
export const ILOCK_SERVICE = 'ILOCK_SERVICE';

export interface ICacheMemory {
    get(key: string): Promise<string | null>;
    getKeys(pattern: string): Promise<string[]>;
    set(key: string, value: string, ttl?: number): Promise<void>;
    increment(key: string): Promise<void>;
    decrement(key: string): Promise<void>;
    remove(key: string): Promise<void>;
    sAdd(key: string, member: string): Promise<void>
    sMembers(key: string): Promise<string[]>
    renameKey(oldKey: string, newKey: string): Promise<void>
    getKeysAndLikeCount(keys: string[]): Promise<{ [key: string]: string | null }>
    renameTransaction(oldKey: string, newKey: string): Promise<void>
    sScan(key: string, cursor: number, batchSize: number): Promise<[number, string[]]>
}

export interface ILockService {
    acquire(key: string, ttl: number): Promise<any>;
    release(lockOrKey: any): Promise<void>;
}