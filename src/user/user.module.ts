import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/entities/Users";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserValidation } from "./user.validation";
import { UserRepository } from "./repositorys/user.repository";
import { AuthModule } from "src/common/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { AppConfigModule } from "src/common/configs/config.module";
import { EncryptModule } from "./encrypts/encrypt.module";

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
        UserRepository,
        UserValidation,
    ],
    exports:[
        UserRepository
    ]
})

export class UserModule {}