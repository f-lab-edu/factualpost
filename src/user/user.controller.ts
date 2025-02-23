import { Body, Controller, createParamDecorator, Delete, ExecutionContext, Get, Param, Post, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDTO } from "src/types";
import { SignInUser, SignOutUser, LoginUser, LogoutUser } from "./dtos/user.dto";
import { JwtAuthGuard } from "src/common/auth/auth.guard";
import { GetUser } from "src/common/decorators/user.param.decorator";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Post('sign-up')
    async signUp(@Body() userData: SignInUser) {
        await this.userService.signUp(userData);
        return { message: 'sign-up successful'};
    }

    @Delete('sign-out')
    async signOut(@Body() userData: SignOutUser) {
        await this.userService.signOut(userData);
        return { message: 'sign-out successful'};
    }

    @Post('login')
    async login(@Body() userData: LoginUser) {
        console.log(userData);
        const token = await this.userService.login(userData);
        return { token, message: 'login successful' };
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@GetUser() user: LogoutUser) {
        await this.userService.logout(user);
        return { message: 'logout successful' };
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findById(@Param() id: string): Promise<UserDTO> {
        const user = await this.userService.findById(id);
        return user;
    }

    @Get(':page')
    @UseGuards(JwtAuthGuard)
    async findAll(page: string): Promise<UserDTO[]> {
        const users = await this.userService.findAll(page);
        return users;
    }
}