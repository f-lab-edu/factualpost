import { ConflictException, HttpStatus, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/entities/Users";
import { IsNull, Repository } from "typeorm";
import { DataSource } from 'typeorm';
import { SignInUser } from "../dtos/user.dto";
import { UserDTO } from "src/types";
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { CONFIG_SERVICE, IConfigService } from "src/common/configs/config.interface.service";
import { IUserRepository } from "./interface/user.repository.interface";

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>,
        @Inject(CONFIG_SERVICE) private readonly configService: IConfigService,
        private readonly dataSource: DataSource,
    ){}

    async createUser(user: SignInUser): Promise<void> {
        await this.userRepository.insert(user);
    }

    async isExist(userId: string): Promise<boolean> {
        return this.userRepository.exists({ 
            where: { 
                userId, 
                deletedAt: IsNull() 
            }
        });
    }

    async signOut(user: Users): Promise<void> {
        await this.userRepository.softRemove(user);
    }

    async findById(id: number): Promise<Users> {
        const user = await this.userRepository.findOneBy({ 
            id: id 
        });

        if(!user) {
            throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
        }

        return user;
    }

    async findByUserId(userId: string): Promise<Users> {
        const user = await this.userRepository.findOneBy({
            userId: userId,
        });

        if (!user) {
            throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
        }

        return user;
    }
    
    async findAllUser(page: number): Promise<UserDTO[]> {
        const pageLimit = this.configService.getPageLimit();
        const offset = (page - 1) * pageLimit;
        const users = await this.userRepository.find({
            skip: offset,
            take: pageLimit,
        });
    
        return users;
    }
}