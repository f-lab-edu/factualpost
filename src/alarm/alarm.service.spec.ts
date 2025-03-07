import { Test, TestingModule } from '@nestjs/testing';
import { AlarmService } from './alarm.service';
import { AlarmRepository } from './repositorys/alarm.repository';
import { LikeRepository } from '../like/repositorys/like.repository';
import { ArticleRepository } from '../article/repositorys/article.typeorm.repository';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Article } from '../entities/Article';
import { Like } from '../entities/Like';
import { ERROR_MESSAGES } from 'src/common/constants/error-message';

describe('AlarmService', () => {
    let service: AlarmService;
    let alarmRepository: jest.Mocked<AlarmRepository>;
    let likeRepository: jest.Mocked<LikeRepository>;
    let articleRepository: jest.Mocked<ArticleRepository>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AlarmService,
                {
                    provide: AlarmRepository,
                    useValue: {
                        saveAlarms: jest.fn(),
                        read: jest.fn(),
                    },
                },
                {
                    provide: LikeRepository,
                    useValue: {
                        findUsersWhoLikedArticle: jest.fn(),
                    },
                },
                {
                    provide: ArticleRepository,
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AlarmService>(AlarmService);
        alarmRepository = module.get(AlarmRepository);
        likeRepository = module.get(LikeRepository);
        articleRepository = module.get(ArticleRepository);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('sendAlarms', () => {
        it('should send alarms successfully', async () => {
            const mockArticle = { id: 1, title: 'Test Article', user: { id: 1 } } as Article;
            const mockLikes = [{ user: { id: 2 } }, { user: { id: 3 } }] as Like[];

            articleRepository.findOne.mockResolvedValue(mockArticle);
            likeRepository.findUsersWhoLikedArticle.mockResolvedValue(mockLikes);

            await service.sendAlarms(1, 1);

            expect(alarmRepository.saveAlarms).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        type: 'NEW_NOTIFICATION',
                        isRead: false,
                    }),
                ])
            );
        });

        it('should throw ForbiddenException if user is not the article author', async () => {
            const mockArticle = { id: 1, user: { id: 2 } } as Article;
            articleRepository.findOne.mockResolvedValue(mockArticle);

            await expect(service.sendAlarms(1, 1)).rejects.toThrow(ForbiddenException);
        });

        it('should not send alarms if no users liked the article', async () => {
            const mockArticle = { id: 1, user: { id: 1 } } as Article;
            articleRepository.findOne.mockResolvedValue(mockArticle);
            likeRepository.findUsersWhoLikedArticle.mockResolvedValue([]);

            await expect(service.sendAlarms(1, 1)).rejects.toThrowError(
                new BadRequestException(ERROR_MESSAGES.NOT_EXIST_LIKED_USER)
            );

            expect(alarmRepository.saveAlarms).not.toHaveBeenCalled();
        });
    });

    describe('readAlarm', () => {
        it('should mark alarm as read', async () => {
            await service.readAlarm(1);
            expect(alarmRepository.read).toHaveBeenCalledWith(1);
        });
    });
});
