export const CACHE_MEMORY_SERVICE = 'CACHE_MEMORY_SERVICE';

export interface ICacheMemory {
    get(key: string): Promise<string | null>;
    getKeys(pattern: string): Promise<string[]>;
    getAndRemove(key: string): Promise<string | null>;
    set(key: string, value: string, ttl?: number): Promise<void>;
    increment(key: string): Promise<void>;
    decrement(key: string): Promise<void>;
    remove(key: string): Promise<void>;
}