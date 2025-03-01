import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { UserValidation } from "src/user/user.validation";
import { AppConfigService } from "../configs/config.service";
import { CONFIG_SERVICE, IConfigService } from "../configs/config.interface.service";

@ValidatorConstraint({ async: true })
@Injectable()
export class HaveSpecialChar implements ValidatorConstraintInterface{

    constructor(
        @Inject(CONFIG_SERVICE) private readonly configService: IConfigService,
        private readonly userValidation: UserValidation,
    ) {}

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        return await this.userValidation.containSpecialCharacter(value);
    }

    defaultMessage(args: ValidationArguments): string {
        const specialCharCount = this.configService.getSpecialCharCount();
        return `비밀번호에는 특수문자 ${specialCharCount} 이상 필요합니다.`;
    }
}
