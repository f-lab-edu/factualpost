import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppConfigService } from "./config.service";
import { CONFIG_SERVICE } from "./config.interface.service";


@Module({
    imports: [
        ConfigModule.forRoot()
    ],
    providers: [
        {
            provide: CONFIG_SERVICE,
            useClass: AppConfigService,
        }
    ],
    exports: [
        CONFIG_SERVICE,
    ]
})
export class AppConfigModule {}
