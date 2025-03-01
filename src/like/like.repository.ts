import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleRepository } from "src/article/article.repository";
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { Like } from "src/entities/Like";
import { UserRepository } from "src/user/user.repository";
import { Repository } from "typeorm";

@Injectable()
export class LikeRepository {
    constructor(
        @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
        private readonly userRepository: UserRepository,
        private readonly articleRepository: ArticleRepository,
    ){}

    async findByIds(userId: number, articleId: number): Promise<Like | null> {
        return await this.likeRepository.findOne({
            where: { user: { id: userId }, article: { id: articleId } },
            relations: ['user', 'article'],
            withDeleted: true
        });
    }

    async saveLike(userId: number, articleId: number): Promise<Like> {
        const user = await this.userRepository.findById(userId);
        const article = await this.articleRepository.findById(articleId);

        if (!user || !article) {
            throw new NotFoundException(ERROR_MESSAGES.ARTICLE_USER_NOT_FOUND);
        }

        const like = this.likeRepository.create({ user, article });
        return await this.likeRepository.save(like);
    }

    async softDeleteLike(like: Like): Promise<void> {
        await this.likeRepository.softRemove(like);
    }

    async restoreLike(like: Like): Promise<void> {
        await this.likeRepository.restore(like.id);
    }

}