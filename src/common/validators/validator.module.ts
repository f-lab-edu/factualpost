import { Module } from "@nestjs/common";
import { RangeValidator } from "./user.range.validator";
import { UserValidation } from "src/user/user.validation";
import { HaveSpecialChar } from "./user.password.validator";
import { UserModule } from "src/user/user.module";

@Module({
    imports:[
        UserModule
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