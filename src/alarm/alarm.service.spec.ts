import { Test, TestingModule } from '@nestjs/testing';
import { AlarmService } from './alarm.service';
import { IALARM_REPOSITORY, IAlarmRepository } from './repositorys/alarm.interface';
import { IARTICLE_REPOSITORY, IArticleRepository } from '../article/repositorys/interface/article.interface';
import { ILIKE_REPOSITORY, ILikeRepository } from '../like/repositorys/interface/like.interface';
import { CONFIG_SERVICE, IConfigService } from 'src/common/configs/config.interface.service';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { Alarm } from '../entities/Alarm';
import { Article } from '../entities/Article';
import { Like } from '../entities/Like';
import { ERROR_MESSAGES } from 'src/common/constants/error-message';
import { SearchData } from './dtos/alarm.dto';

describe('AlarmService', () => {
    let service: AlarmService;
    let alarmRepository: jest.Mocked<IAlarmRepository>;
    let likeRepository: jest.Mocked<ILikeRepository>;
    let articleRepository: jest.Mocked<IArticleRepository>;
    let configService: jest.Mocked<IConfigService>;

    beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: 
        [
            AlarmService,
            {
                provide: IALARM_REPOSITORY,
                useValue: {
                saveAlarms: jest.fn(),
                read: jest.fn(),
                getAlarms: jest.fn(),
                },
            },
            {
                provide: IARTICLE_REPOSITORY,
                useValue: {
                findOne: jest.fn(),
                },
            },
            {
                provide: ILIKE_REPOSITORY,
                useValue: {
                findUsersWhoLikedArticle: jest.fn(),
                },
            },
            {
                provide: CONFIG_SERVICE,
                useValue: {
                getAlarmType: jest.fn(),
                getAdminAlarmType: jest.fn(),
                },
            },
        ],
    }).compile();

    service = module.get<AlarmService>(AlarmService);
    alarmRepository = module.get(IALARM_REPOSITORY);
    likeRepository = module.get(ILIKE_REPOSITORY);
    articleRepository = module.get(IARTICLE_REPOSITORY);
    configService = module.get(CONFIG_SERVICE);
    });

    beforeEach(() => {
    jest.clearAllMocks();
    });

    describe('sendAlarms', () => {
        it('should send alarms successfully', async () => {
            const mockArticle = { id: 1, title: 'Test Article', user: { id: 1 } } as Article;
            const mockLikes = [{ user: { id: 2 } }, { user: { id: 3 } }] as Like[];
            const alarmType = 'NEW_NOTIFICATION';

            articleRepository.findOne.mockResolvedValue(mockArticle);
            likeRepository.findUsersWhoLikedArticle.mockResolvedValue(mockLikes);
            configService.getAlarmType.mockReturnValue(alarmType);

            await service.sendAlarms(1, 1);

            expect(alarmRepository.saveAlarms).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                type: alarmType,
                isRead: false,
                message: `게시글 "${mockArticle.title}"에 대한 새로운 알림이 있습니다.`,
                }),
            ])
            );
        });

        it('should throw ForbiddenException if user is not the article author', async () => {
            const mockArticle = { id: 1, user: { id: 2 } } as Article;
            articleRepository.findOne.mockResolvedValue(mockArticle);

            await expect(service.sendAlarms(1, 1)).rejects.toThrow(ForbiddenException);
        });

        it('should throw BadRequestException if no users liked the article', async () => {
            const mockArticle = { id: 1, user: { id: 1 } } as Article;
            articleRepository.findOne.mockResolvedValue(mockArticle);
            likeRepository.findUsersWhoLikedArticle.mockResolvedValue([]);
            const errorMessage = ERROR_MESSAGES.NOT_EXIST_LIKED_USER;

            await expect(service.sendAlarms(1, 1)).rejects.toThrowError(new BadRequestException(errorMessage));

            expect(alarmRepository.saveAlarms).not.toHaveBeenCalled();
        });
    });

    describe('sendAdminAlarms', () => {
        it('should send admin alarms successfully', async () => {
            const mockArticle = { id: 1, title: 'Test Article', user: { id: 1 } } as Article;
            const mockLikes = [{ user: { id: 2 } }, { user: { id: 3 } }] as Like[];
            const adminAlarmType = 'ADMIN_NOTIFICATION';

            articleRepository.findOne.mockResolvedValue(mockArticle);
            likeRepository.findUsersWhoLikedArticle.mockResolvedValue(mockLikes);
            configService.getAdminAlarmType.mockReturnValue(adminAlarmType);

            await service.sendAdminAlarms(1);

            expect(alarmRepository.saveAlarms).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                type: adminAlarmType,
                isRead: false,
                message: `게시글 "${mockArticle.title}"에 대한 새로운 알림이 있습니다.`,
                }),
            ])
            );
        });
    });

    describe('readAlarm', () => {
        it('should mark alarm as read', async () => {
            const alarmId = '1';
            await service.readAlarm(alarmId);
            expect(alarmRepository.read).toHaveBeenCalledWith(alarmId);
        });
    });

    describe('getAlarm', () => {
        it('should return alarms for the user', async () => {
            const mockAlarms = [{ id: '1', user: { id: 1 }, article: { id: 1 }, type: 'NEW_NOTIFICATION' }] as Alarm[];
            const userId = 1;
            const searchData = { type: 'NEW_NOTIFICATION' } as SearchData;
            const cursor = 0;

            alarmRepository.getAlarms.mockResolvedValue(mockAlarms);

            const result = await service.getAlarm(userId, searchData, cursor);

            expect(result).toEqual(mockAlarms);
            expect(alarmRepository.getAlarms).toHaveBeenCalledWith(userId, searchData, cursor);
        });
    });
});
