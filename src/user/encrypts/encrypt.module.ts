import { Module } from "@nestjs/common";
import { ENCRYPT_SERVICE } from "./encrypt.interface";
import { EncryptService } from "./encrypt.service";

@Module({
    imports:[

    ],
    providers:[
        {
            provide: ENCRYPT_SERVICE,
            useClass: EncryptService,
        }
    ],
    exports: [
        ENCRYPT_SERVICE
    ]

})

export class EncryptModule {}