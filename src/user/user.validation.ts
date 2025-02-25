import * as bcrypt from 'bcryptjs';
import { BadRequestException, Injectable } from "@nestjs/common";
import { UserDTO } from 'src/types';
import { ConfigService } from "@nestjs/config";
import { UserRepository } from './user.repository';
import { UserProfile, SignInUser, LoginUser } from 'src/types';
import { ERROR_MESSAGES } from 'src/common/constants/error-message';

@Injectable()
export class UserValidation {
    constructor(
        private readonly configService: ConfigService,
        private readonly userRepository: UserRepository,
    ){}

    async verifyLogin(user: LoginUser): Promise<UserProfile> {
        const userInfo = await this.userRepository.findByUserId(user.userId);
        await this.verifyPassword(user.password, userInfo.password);
        return this.excludePassword(userInfo);
    }

    async verifyPassword(password: string, bcryptPassword: string): Promise<void> {
        const compareResult = await bcrypt.compare(password, bcryptPassword);
        if(!compareResult) {
            throw new BadRequestException(ERROR_MESSAGES.INCORRECT_CREDENTIALS);
        }
    }

    async encodePassword(user: SignInUser): Promise<void> {
        user.password = await bcrypt.hash(user.password, this.configService.get<number>('user.passwordRound')!);
    }

    async checkInputRange(target: string, min: number, max: number): Promise<boolean> {
        return target.length >= min && target.length <= max;
    }

    async containSpecialCharacter(password: string): Promise<boolean> {
        const specialCharRegexString = this.configService.get<string>('user.specialType')!;
        const specialCharRegex = new RegExp(specialCharRegexString);
        return specialCharRegex.test(password);
    }

    private excludePassword(user: UserDTO): UserProfile {
        const { password, ...userProfile } = user;
        return userProfile;
    }
}