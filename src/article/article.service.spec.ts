import { Test, TestingModule } from "@nestjs/testing";
import { ForbiddenException } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { IArticleRepository } from "./repositorys/interface/article.interface";
import { IUserRepository } from "src/user/repositorys/interface/user.repository.interface";
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { Users } from "src/entities/Users";
import { ArticleMeta } from "src/entities/article-meta";

describe("ArticleService", () => {
    let articleService: ArticleService;
    let articleRepository: IArticleRepository;
    let userRepository: IUserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ArticleService,
                {
                    provide: "IARTICLE_REPOSITORY",
                    useValue: {
                        getArticles: jest.fn(),
                        getArticle: jest.fn(),
                        write: jest.fn(),
                        findOne: jest.fn(),
                        remove: jest.fn(),
                        update: jest.fn(),
                    },
                },
                {
                    provide: "IUSER_REPOSITORY",
                    useValue: {
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        articleService = module.get<ArticleService>(ArticleService);
        articleRepository = module.get<IArticleRepository>("IARTICLE_REPOSITORY");
        userRepository = module.get<IUserRepository>("IUSER_REPOSITORY");
    });

    it("should be defined", () => {
        expect(articleService).toBeDefined();
        expect(articleRepository).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    describe("getArticles", () => {
        it("should call getArticles from articleRepository", async () => {
            const searchData = { keyword: "test" };
            const mockArticles = [new ArticleMeta()];
            jest.spyOn(articleRepository, "getArticles").mockResolvedValue(mockArticles);

            const result = await articleService.getArticles(searchData);

            expect(articleRepository.getArticles).toHaveBeenCalledWith(searchData);
            expect(result).toEqual(mockArticles);
        });
    });

    describe("getArticle", () => {
        it("should return an article by ID", async () => {
            const articleId = 1;
            const mockArticle = { id: articleId, title: "Test Article" };
            jest.spyOn(articleRepository, "getArticle").mockResolvedValue(mockArticle);

            const result = await articleService.getArticle(articleId);

            expect(articleRepository.getArticle).toHaveBeenCalledWith(articleId);
            expect(result).toEqual(mockArticle);
        });
    });

    describe("write", () => {
        it("should create an article and return its ID", async () => {
            const articleData = { title: "Test Title", contents: "Test Content", userId: 1 };
            const mockUser = new Users();
            jest.spyOn(userRepository, "findById").mockResolvedValue(mockUser);
            jest.spyOn(articleRepository, "write").mockResolvedValue(1);

            const result = await articleService.write(articleData);

            expect(userRepository.findById).toHaveBeenCalledWith(articleData.userId);
            expect(articleRepository.write).toHaveBeenCalled();
            expect(result).toEqual(1);
        });
    });

    describe("update", () => {
        it("should update an article if the user is authorized", async () => {
            const articleData = { title: "Updated Title", contents: "Updated Content", userId: 1 };
            const articleId = 1;
            const mockArticle = { userId: 1 };
            jest.spyOn(articleRepository, "findOne").mockResolvedValue(mockArticle);
            jest.spyOn(articleRepository, "update").mockResolvedValue();

            await articleService.update(articleData, articleId);

            expect(articleRepository.findOne).toHaveBeenCalledWith(articleId);
            expect(articleRepository.update).toHaveBeenCalledWith(articleData, articleId);
        });

        it("should throw an error if the user is unauthorized", async () => {
            const articleData = { title: "Updated Title", contents: "Updated Content", userId: 2 };
            const articleId = 1;
            const mockArticle = { userId: 1 };
            jest.spyOn(articleRepository, "findOne").mockResolvedValue(mockArticle);

            await expect(articleService.update(articleData, articleId)).rejects.toThrow(
                new ForbiddenException(ERROR_MESSAGES.UNAUTHORIZED_UPDATE),
            );
        });
    });

    describe("remove", () => {
        it("should remove an article if the user is authorized", async () => {
            const userId = 1;
            const articleId = 1;
            const mockArticle = { userId };
            jest.spyOn(articleRepository, "findOne").mockResolvedValue(mockArticle);
            jest.spyOn(articleRepository, "remove").mockResolvedValue();

            await articleService.remove(userId, articleId);

            expect(articleRepository.findOne).toHaveBeenCalledWith(articleId);
            expect(articleRepository.remove).toHaveBeenCalledWith(mockArticle);
        });

        it("should throw an error if the user is unauthorized", async () => {
            const userId = 2;
            const articleId = 1;
            const mockArticle = { userId: 1 };
            jest.spyOn(articleRepository, "findOne").mockResolvedValue(mockArticle);

            await expect(articleService.remove(userId, articleId)).rejects.toThrow(
                new ForbiddenException(ERROR_MESSAGES.UNAUTHORIZED_DELETE),
            );
        });
    });
});
