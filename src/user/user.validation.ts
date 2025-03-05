import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { UserDTO } from 'src/types';
import { UserRepository } from './repositorys/user.repository';
import { UserProfile, LoginUser } from "./dtos/user.dto";
import { ERROR_MESSAGES } from 'src/common/constants/error-message';
import { CONFIG_SERVICE, IConfigService } from 'src/common/configs/config.interface.service';
import { ENCRYPT_SERVICE, IEncryptService } from './encrypts/encrypt.interface';

@Injectable()
export class UserValidation {
    constructor(
        @Inject(CONFIG_SERVICE) private readonly configService: IConfigService,
        @Inject(ENCRYPT_SERVICE) private readonly encryptService: IEncryptService,
        private readonly userRepository: UserRepository,
    ){}

    async verifyLogin(user: LoginUser): Promise<UserProfile> {
        const userInfo = await this.userRepository.findByUserId(user.userId);
        await this.validatePassword(user.password, userInfo.password);
        return this.excludePassword(userInfo);
    }

    async validatePassword(password: string, hashedPassword: string) {
        const isValid = await this.comparePassword(password, hashedPassword);
        if (!isValid) {
            throw new BadRequestException(ERROR_MESSAGES.INCORRECT_CREDENTIALS);
        }
    }

    async comparePassword(password: string, bcryptPassword: string): Promise<boolean> {
        return await this.encryptService.compare(password, bcryptPassword);
    }

    async encodePassword(password: string): Promise<string> {
        return await this.encryptService.hash(password, this.configService.getPasswordRound());
    }

    async checkInputRange(target: string, min: number, max: number): Promise<boolean> {
        return target.length >= min && target.length <= max;
    }

    async containSpecialCharacter(password: string): Promise<boolean> {
        return this.configService.getSpecialCharRegex().test(password);
    }

    private excludePassword(user: UserDTO): UserProfile {
        const { password, ...userProfile } = user;
        return userProfile;
    }
}