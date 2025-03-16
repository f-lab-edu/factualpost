import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Users } from './Users';
import { ArticleMeta } from './article-meta';

@Entity('alarms')
@Index('idx_user_alarms', ['userId', 'isRead', 'createdAt'])
export class Alarm extends BaseEntity {
    @Column({ type: 'int', nullable: false })
    userId: number;

    @Column({ type: 'bigint', nullable: true })
    articleId: number;

    @Column({ type: 'tinyint', nullable: false })
    type: number;

    @Column({ type: 'text', nullable: false })
    message: string;

    @Column({ type: 'tinyint', width: 1, default: 0 })
    isRead: boolean;

    @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: Users;

    @ManyToOne(() => ArticleMeta, (article) => article.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'articleId' })
    article: ArticleMeta;
}
