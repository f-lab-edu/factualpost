export const ENCRYPT_SERVICE = 'ENCRYPT_SERVICE';

export interface IEncryptService {
    compare(password: string, hash: string): Promise<boolean>;
    hash(password: string, saltRounds: number): Promise<string>;
}