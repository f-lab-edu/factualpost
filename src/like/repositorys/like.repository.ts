import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { Like } from "src/entities/Like";
import { IUSER_REPOSITORY, IUserRepository } from "src/user/repositorys/interface/user.repository.interface";
import { Repository } from "typeorm";
import { ILikeRepository } from "./interface/like.interface";
import { IARTICLE_REPOSITORY, IArticleRepository } from "src/article/repositorys/interface/article.interface";
import { LikeRequestDto } from "../dtos/like.dto";

@Injectable()
export class LikeTypeOrmRepository implements ILikeRepository{
    constructor(
        @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
        @Inject(IUSER_REPOSITORY) private readonly userRepository: IUserRepository,
        @Inject(IARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
    ){}

    async findByIds(likeRequest: LikeRequestDto): Promise<Like | null> {
        return await this.likeRepository.findOne({
            where: { user: { id: likeRequest.userId }, article: { id: likeRequest.articleId } },
            relations: ['user', 'article'],
            withDeleted: true
        });
    }

    async saveLike(likeRequest: LikeRequestDto): Promise<Like> {

        const [user, article] = await Promise.all([
            this.userRepository.findById(likeRequest.userId),
            this.articleRepository.findById(likeRequest.articleId)
        ])

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

    async findUsersWhoLikedArticle(articleId: number): Promise<Like[]> {
        return await this.likeRepository
                        .createQueryBuilder('like')
                        .leftJoinAndSelect('like.user', 'user')
                        .where('like.article.id = :articleId', {articleId})
                        .getMany();
    }

}