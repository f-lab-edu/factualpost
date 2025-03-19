export const CACHE_MEMORY_SERVICE = 'CACHE_MEMORY_SERVICE';

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
}