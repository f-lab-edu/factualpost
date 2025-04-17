import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Users } from './Users';
import { ArticleMeta } from './article-meta';

@Entity('likes')
@Index('uq_like', ['articleId', 'userId'], { unique: true })
@Index('idx_article_created', ['articleId', 'createdAt'])
export class Like extends BaseEntity {
    @Column({ type: 'int', nullable: false })
    userId: number;

    @Column({ type: 'bigint', nullable: false })
    articleId: number;

    @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: Users;

    @ManyToOne(() => ArticleMeta, (article) => article.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'articleId' })
    article: ArticleMeta;
}
