import { ConflictException, HttpStatus, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/entities/Users";
import { IsNull, Repository } from "typeorm";
import { DataSource } from 'typeorm';
import { SignInUser } from "./dtos/user.dto";
import { UserDTO } from "src/types";
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { CONFIG_SERVICE, IConfigService } from "src/common/configs/config.interface.service";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>,
        @Inject(CONFIG_SERVICE) private readonly configService: IConfigService,
        private readonly dataSource: DataSource,
    ){}

    async createUser(user: SignInUser): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
    
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
    
            const { userId } = user;
            const existUser = await this.isExist(userId);
    
            if (existUser) {
                throw new ConflictException(HttpStatus.CONFLICT);
            }
    
            await queryRunner.manager
                            .createQueryBuilder()
                            .insert()
                            .into(Users)
                            .values(user)
                            .execute();
    
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    private async isExist(userId: string): Promise<boolean> {
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