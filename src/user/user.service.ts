import { Inject, Injectable } from "@nestjs/common";
import { IUSER_REPOSITORY, IUserRepository } from "./repositorys/interface/user.repository.interface";
import { UserValidation } from "./user.validation";
import { SignInUser, SignOutUser, LoginUser, LogoutUser } from "./dtos/user.dto";
import { UserDTO, Tokens } from "src/types";
import { AuthService } from "src/common/auth/service/auth.service";

@Injectable()
export class UserService {
    constructor(
        @Inject(IUSER_REPOSITORY) private readonly userRepository: IUserRepository,
        private readonly userValidation: UserValidation,
        private readonly authService: AuthService,
    ){}

    async signUp(userData: SignInUser): Promise<void> {
        await this.userValidation.isExistUser(userData.userId);
        const encodedPassword = await this.userValidation.encodePassword(userData.password);
        const userWithEncodedPassword = { ...userData, password: encodedPassword };
        await this.userRepository.createUser(userWithEncodedPassword);
    }

    async signOut(userData: SignOutUser): Promise<void> {
        const user = await this.userRepository.findByUserId(userData.userId);
        await this.userValidation.validatePassword(userData.password, user.password);
        await this.userRepository.signOut(user);
    }

    async login(userData: LoginUser): Promise<Tokens> {
        const userProfile = await this.userValidation.verifyLogin(userData);
        return await this.authService.authenticateUser(userProfile);
    }

    async logout(user: LogoutUser): Promise<void> {
        await this.authService.logOutUser(user);
    }

    async findById(userId: string): Promise<UserDTO> {
        return await this.userRepository.findByUserId(userId);
    }

    async findAll(page: string): Promise<UserDTO[]> {
        return await this.userRepository.findAllUser(Number(page));
    }
}