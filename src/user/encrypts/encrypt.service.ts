import * as bcrypt from 'bcryptjs';
import { Injectable } from "@nestjs/common";
import { IEncryptService } from "./encrypt.interface";

@Injectable()
export class EncryptService implements IEncryptService {
    async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    async hash(password: string, saltRounds: number): Promise<string> {
        return bcrypt.hash(password, saltRounds);
    }
}