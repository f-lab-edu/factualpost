export const CACHE_MEMORY_SERVICE = 'CACHE_MEMORY_SERVICE';

export interface ICacheMemory {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
}