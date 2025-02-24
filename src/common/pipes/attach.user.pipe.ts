import { PipeTransform, Injectable, ArgumentMetadata, Inject, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AttachUserPipe implements PipeTransform {
    private readonly logger = new Logger(AttachUserPipe.name);
    constructor(
        @Inject(REQUEST) private readonly request: Request
    ) {}
    transform(value: any, metadata: ArgumentMetadata): any {
        if (this.isObject(value)) {
            const user = this.request['user'];

            if (user && user.id !== undefined) {
                value.userId = user.id;
            }
        } else {
            this.logger.warn(`AttachUserPipe: value is not an object. Skipping transformation. Value: ${value}`);
        }

        return value;
    }

    private isObject(value: any): boolean {
        return typeof value === 'object' && value !== null;
    }
}
