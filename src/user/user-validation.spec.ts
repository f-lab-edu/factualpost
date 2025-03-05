import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { UserValidation } from "./user.validation";
import { IUSER_REPOSITORY, IUserRepository } from "./repositorys/interface/user.repository.interface";
import { IEncryptService } from "./encrypts/encrypt.interface";
import { IConfigService } from "src/common/configs/config.interface.service";
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { Users } from "src/entities/Users";
import { LoginUser } from "./dtos/user.dto";

describe("UserValidation", () => {
    let userValidation: UserValidation;
    let userRepository: jest.Mocked<IUserRepository>;
    let encryptService: jest.Mocked<IEncryptService>;
    let configService: jest.Mocked<IConfigService>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserValidation,
                {
                    provide: "IUSER_REPOSITORY",
                    useValue: { findByUserId: jest.fn() },
                },
                {
                    provide: "ENCRYPT_SERVICE",
                    useValue: { compare: jest.fn(), hash: jest.fn() },
                },
                {
                    provide: "CONFIG_SERVICE",
                    useValue: { getPasswordRound: jest.fn(), getSpecialCharRegex: jest.fn() },
                },
            ],
        }).compile();

        userValidation = module.get<UserValidation>(UserValidation);
        userRepository = module.get("IUSER_REPOSITORY");
        encryptService = module.get("ENCRYPT_SERVICE");
        configService = module.get("CONFIG_SERVICE");
    });

    beforeEach(() => {
        jest.clearAllMocks(); // 각 테스트 실행 전 모든 mock 초기화
    });

    describe("#verifyLogin", () => {
        it("should return user profile if credentials are correct", async () => {
            const mockUser: Users = { 
                id: 1,
                userId: "testUser",
                password: "hashedPassword",
                createdAt: new Date(),
                deletedAt: new Date(),
                alarms: [],
                likes: [],
                articles: [],
            };

            const loginUser: LoginUser = { userId: "testUser", password: "plainPassword" };

            userRepository.findByUserId.mockResolvedValue(mockUser);
            encryptService.compare.mockResolvedValue(true);

            const result = await userValidation.verifyLogin(loginUser);
            expect(result).not.toHaveProperty("password");
            expect(result.userId).toBe(mockUser.userId);
        });

        it("should throw BadRequestException if password does not match", async () => {
            const mockUser: Users = { 
                id: 1,
                userId: "testUser",
                password: "hashedPassword",
                createdAt: new Date(),
                deletedAt: new Date(),
                alarms: [],
                likes: [],
                articles: [],
            };

            const loginUser: LoginUser = { userId: "testUser", password: "wrongPassword" };

            userRepository.findByUserId.mockResolvedValue(mockUser);
            encryptService.compare.mockResolvedValue(false);

            await expect(userValidation.verifyLogin(loginUser)).rejects.toThrow(BadRequestException);
            await expect(userValidation.verifyLogin(loginUser)).rejects.toThrow(ERROR_MESSAGES.INCORRECT_CREDENTIALS);
        });
    });

    describe("#encodePassword", () => {
        it("should return hashed password", async () => {
            configService.getPasswordRound.mockReturnValue(10);
            encryptService.hash.mockResolvedValue("hashedPassword");

            const result = await userValidation.encodePassword("myPassword");
            expect(result).toBe("hashedPassword");
        });
    });

    describe("#checkInputRange", () => {
        it('should return true for valid length', async () => {
            const result = await userValidation.checkInputRange("validString", 5, 15);
            expect(result).toBe(true);
        });

        it('should return false for out of range length', async () => {
            const result = await userValidation.checkInputRange("short", 6, 15);
            expect(result).toBe(false);
        });
    });

    describe("#containSpecialCharacter", () => {
        it("should return true if password contains special characters", async () => {
            configService.getSpecialCharRegex.mockReturnValue(/[!@#$%^&*]/);
            const result = await userValidation.containSpecialCharacter("password@123");
            expect(result).toBe(true);
        });

        it("should return false if password does not contain special characters", async () => {
            configService.getSpecialCharRegex.mockReturnValue(/[!@#$%^&*]/);
            const result = await userValidation.containSpecialCharacter("password123");
            expect(result).toBe(false);
        });
    });
});
