import { Test, TestingModule } from "@nestjs/testing";
import { LikeService } from "./like.service"
import { LikeCacheService } from "./services/like.cache.service";
import { LikePersistenceService } from "./services/like.persistence.service"
import { LikeSyncService } from "./services/like.sync.service";
import { LikeRequestDto } from "./dtos/like.dto";
import { LikeType } from "./like.util";

describe('Like Service', () => {
    let likeService: LikeService;
    let likePersistenceService: jest.Mocked<LikePersistenceService>;
    let likeCacheService: jest.Mocked<LikeCacheService>;
    let likeSyncService: jest.Mocked<LikeSyncService>;

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LikeService,
                {
                    provide: LikePersistenceService,
                    useValue: { add: jest.fn(), remove: jest.fn() },
                },
                {
                    provide: LikeCacheService,
                    useValue: { increaseLike: jest.fn(), decreaseLike: jest.fn() },
                },
                {
                    provide: LikeSyncService,
                    useValue: { addSyncJob: jest.fn() },
                },
            ],
        }).compile();

        likeService = module.get<LikeService>(LikeService);
        likePersistenceService = module.get(LikePersistenceService);
        likeCacheService = module.get(LikeCacheService);
        likeSyncService = module.get(LikeSyncService);
    })

    it('should call increaseLike and addSyncJon on addLike', async () => {
        const likeRequest: LikeRequestDto = { userId: 1, articleId: 100 };
        await likeService.addLike(likeRequest);
        expect(likeCacheService.increaseLike).toHaveBeenCalledWith(likeRequest.articleId);
        expect(likeSyncService.addSyncJob).toHaveBeenCalledWith(likeRequest.userId, likeRequest.articleId, LikeType.ADD);
    })

    it('should call decreaseLike and addSyncJob on removeLike', async () => {
        const likeRequest: LikeRequestDto = { userId: 1, articleId: 100 };
        await likeService.removeLike(likeRequest);
        expect(likeCacheService.decreaseLike).toHaveBeenCalledWith(likeRequest.articleId);
        expect(likeSyncService.addSyncJob).toHaveBeenCalledWith(likeRequest.userId, likeRequest.articleId, LikeType.REMOVE);
    })

    it('should call persistence service add on add', async () => {
        const likeRequest: LikeRequestDto = { userId: 1, articleId: 100 };
        await likeService.add(likeRequest);
        expect(likePersistenceService.add).toHaveBeenCalledWith(likeRequest);
    })

    it('should call persistence service remove on remove', async () => {
        const likeRequest: LikeRequestDto = { userId: 1, articleId: 100 };
        await likeService.remove(likeRequest);
        expect(likePersistenceService.remove).toHaveBeenCalledWith(likeRequest);
    })

})