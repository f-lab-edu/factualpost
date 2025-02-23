import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { UserValidation } from 'src/user/user.validation';

@ValidatorConstraint({ async: true })
@Injectable()
export class RangeValidator implements ValidatorConstraintInterface {
    private readonly fieldNames: Record<string, string> = {
        userId: "아이디",
        password: "비밀번호"
    };

    constructor(
        private readonly configService: ConfigService,
        private readonly userValidation: UserValidation,
    ) {}

    private getConfigValues(property: string): { min: number, max: number } | null {
        const minKey = `user.${property}.min`;
        const maxKey = `user.${property}.max`;

        const min = this.configService.get<number>(minKey);
        const max = this.configService.get<number>(maxKey);

        if (min === undefined || max === undefined) {
            console.error(`설정값을 찾을 수 없습니다: ${minKey}, ${maxKey}`);
            return null;
        }

        return { min, max };
    }

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const range = this.getConfigValues(args.property);
        if (!range) return false;

        return await this.userValidation.checkInputRange(value, range.min, range.max);
    }

    defaultMessage(args: ValidationArguments): string {
        const range = this.getConfigValues(args.property);
        const fieldLabel = this.fieldNames[args.property] || args.property;

        if (!range) {
            return `${fieldLabel}의 유효 범위를 확인할 수 없습니다.`;
        }

        return `${fieldLabel}는 ${range.min}자 이상 ${range.max}자 이하이어야 합니다.`;
    }
}
