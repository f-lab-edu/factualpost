import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/entities/Users";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserValidation } from "./user.validation";
import { UserTypeOrmRepository } from "./repositorys/user.typeorm.repository";
import { AuthModule } from "src/common/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { AppConfigModule } from "src/common/configs/config.module";
import { EncryptModule } from "./encrypts/encrypt.module";
import { IUSER_REPOSITORY } from "./repositorys/interface/user.repository.interface";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Users
        ]),
        AuthModule,
        ConfigModule,
        JwtModule,
        AppConfigModule,
        EncryptModule,
    ],
    controllers: [
        UserController
    ],
    providers: [
        UserService,
        {
            provide: IUSER_REPOSITORY,
            useClass: UserTypeOrmRepository,
        },
        UserValidation,
    ],
    exports:[
        IUSER_REPOSITORY,
    ]
})

export class UserModule {}