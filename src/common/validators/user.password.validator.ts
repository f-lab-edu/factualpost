import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { UserValidation } from "src/user/user.validation";

@ValidatorConstraint({ async: true })
@Injectable()
export class HaveSpecialChar implements ValidatorConstraintInterface{

    constructor(
        private readonly configService: ConfigService,
        private readonly userValidation: UserValidation,
    ) {}

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        return await this.userValidation.containSpecialCharacter(value);
    }

    defaultMessage(args: ValidationArguments): string {
        const specialCharCount = this.configService.get<number>('user.specialCharCount')!;
        return `비밀번호에는 특수문자 ${specialCharCount} 이상 필요합니다.`;
    }
}
