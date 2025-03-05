import { Users } from "src/entities/Users";
import { UserDTO } from "src/types";
import { SignInUser } from "src/user/dtos/user.dto";

export const IUSER_REPOSITORY = 'IUSER_REPOSITORY';

export interface IUserRepository {
    createUser(user: SignInUser): Promise<void>
    signOut(user: Users): Promise<void>
    findById(id: number): Promise<Users>
    findByUserId(userId: string): Promise<Users>
    findAllUser(page: number): Promise<UserDTO[]>
}