import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Users } from './Users';

@Entity('article_meta')
@Index('idx_covering_search', ['userId', 'createdAt', 'deletedAt'])
@Index('idx_created_at', ['createdAt'])
export class ArticleMeta extends BaseEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    title: string;

    @Column({ type: 'int', default: 0, nullable: false })
    likeCount: number;

    @Column({ type: 'timestamp', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updatedAt: Date;

    @Column({ type: 'int', nullable: false })
    userId: number;

    @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: Users;
}
