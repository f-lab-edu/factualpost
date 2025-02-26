import { PickType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";
import { IsInRange } from "src/common/decorators/user.decorator";
import { IsSpecialChar } from "src/common/decorators/user.password.decorator";
import { Users } from "src/entities/Users";

export class UserDto extends PickType(Users, ['userId', 'password'] as const) {
    @IsString()
    @IsInRange()
    userId: string;

    @IsString()
    @IsInRange()
    @IsSpecialChar()
    password: string;
}

export class SignInUser extends PickType(UserDto, ['userId', 'password'] as const) {}
export class LoginUser extends PickType(UserDto, ['userId', 'password'] as const) {}
export class SignOutUser extends PickType(UserDto, ['userId', 'password'] as const) {}

export class UserProfile extends PickType(UserDto, ['userId'] as const) {
    id: number;
    createdAt: Date;
    deletedAt: Date | null;
}

export class LogoutUser extends PickType(UserDto, ['userId'] as const) {
    id: number;
}