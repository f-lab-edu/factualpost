import { PipeTransform, Injectable, ArgumentMetadata, Inject, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { isObject } from 'lodash';

@Injectable()
export class AttachUserPipe implements PipeTransform {
    private readonly logger = new Logger(AttachUserPipe.name);
    constructor(
        @Inject(REQUEST) private readonly request: Request
    ) {}
    transform(value: any, metadata: ArgumentMetadata): any {
        if (isObject(value)) {
            const user = this.request['user'];

            if (user?.id) {
                value.userId = user.id;
                value.username = user.userId;
            }
        } else {
            this.logger.warn(`AttachUserPipe: value is not an object. Skipping transformation. Value: ${value}`);
        }

        return value;
    }
}
