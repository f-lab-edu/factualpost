import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/entities/Users";
import { Repository } from "typeorm";
import { DataSource } from 'typeorm';
import { SignInUser } from "./dtos/user.dto";
import { UserDTO } from "src/types";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>,
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
        const user = await this.dataSource.getRepository(Users).findOne({
            where: { userId },
        });
        return !!user;
    }

    async signOut(userId: string): Promise<void> {
        const user = await this.dataSource.getRepository(Users).findOne({
            where: { userId },
        });
        if(user) {
            await this.userRepository.softRemove(user);
        }
    }

    async findById(userId: string): Promise<Users> {
        const user = await this.userRepository.findOneBy({ userId: userId });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
    

    async findAllUser(page: number): Promise<UserDTO[]> {
        const pageLimit = Number(process.env.PAGE_LIMIT) || 10;
        const offset = (page - 1) * pageLimit;
        const users = await this.userRepository.find({
            skip: offset,
            take: pageLimit,
        });
    
        return users;
    }
}