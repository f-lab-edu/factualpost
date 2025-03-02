import { Module } from "@nestjs/common";
import { RangeValidator } from "./user.range.validator";
import { UserValidation } from "src/user/user.validation";
import { HaveSpecialChar } from "./user.password.validator";
import { UserModule } from "src/user/user.module";
import { AppConfigModule } from "../configs/config.module";
import { EncryptModule } from "src/user/encrypts/encrypt.module";

@Module({
    imports:[
        UserModule,
        AppConfigModule,
        EncryptModule,
    ],
    providers: [
        RangeValidator,
        HaveSpecialChar,
        UserValidation,
    ],
    exports: [
        RangeValidator,
        HaveSpecialChar,
    ],
})
export class ValidatorModule {}