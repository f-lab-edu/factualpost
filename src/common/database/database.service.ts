import { BeforeApplicationShutdown, Injectable, OnModuleDestroy } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class DatabaseService implements OnModuleDestroy, BeforeApplicationShutdown {
    constructor(
        private dataSource: DataSource
    ) {}

    async onModuleDestroy() {
        console.log('Module : Closing Database connection');
        await this.dataSource.destroy();
    }

    async beforeApplicationShutdown() {
        console.log('Application : Closing database connection');
        await this.dataSource.destroy();
    }
}