import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class DatabaseService implements OnModuleDestroy {
    constructor(
        private dataSource: DataSource
    ) {}

    async onModuleDestroy() {
        console.log('Module : Closing Database connection');
        await this.dataSource.destroy();
    }

}