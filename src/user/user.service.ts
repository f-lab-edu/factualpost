import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UserValidation } from "./user.validation";
import { SignInUser, SignOutUser, LoginUser, LogoutUser } from "./dtos/user.dto";
import { UserDTO, Tokens } from "src/types";
import { AuthService } from "src/common/auth/service/auth.service";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly userValidation: UserValidation,
        private readonly authService: AuthService,
    ){}

    async signUp(userData: SignInUser): Promise<void> {
        await this.userValidation.encodePassword(userData);
        await this.userRepository.createUser(userData);
    }

    async signOut(userData: SignOutUser): Promise<void> {
        const user = await this.userRepository.findById(userData.userId);
        await this.userValidation.verifyPassword(userData.password, user.password);
        await this.userRepository.signOut(userData.userId);
    }

    async login(userData: LoginUser): Promise<Tokens> {
        const userProfile = await this.userValidation.verifyLogin(userData);
        return await this.authService.authenticateUser(userProfile);
    }

    async logout(user: LogoutUser): Promise<void> {
        await this.authService.logOutUser(user);
    }

    async findById(userId: string): Promise<UserDTO> {
        return await this.userRepository.findById(userId);
    }

    async findAll(page: string): Promise<UserDTO[]> {
        return await this.userRepository.findAllUser(Number(page));
    }
}