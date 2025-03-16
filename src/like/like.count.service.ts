import { Inject, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { CACHE_MEMORY_SERVICE, ICacheMemory } from "src/common/redis/cache.interface";
import { IARTICLE_REPOSITORY, IArticleRepository } from "src/article/repositorys/interface/article.interface";
import { ARTICLE_ALL_LIKE_COUNT } from "./like.util";

@Injectable()
export class LikeCountService {

    constructor(
        @Inject(CACHE_MEMORY_SERVICE) private readonly cacheService: ICacheMemory,
        @Inject(IARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
    ){}

    @Cron('*/1 * * * *')
    async updateLikeCount() {
        const keys = await this.cacheService.getKeys(ARTICLE_ALL_LIKE_COUNT);
        for(const key of keys) {
            const likeCount = await this.cacheService.getAndRemove(key);
            if(likeCount) {
                const articleId = this.splitKey(key);
                const article = await this.articleRepository.findById(Number(articleId));
                await this.articleRepository.updateLikeCount(article.likeCount, Number(likeCount), Number(articleId));
            }
        }
    }

    splitKey(key: string): string {
        return key.split(':')[1];
    }
}