import { Entity, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Users } from './Users';
import { Article } from './Article';

@Entity("alarms")
export class Alarm {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: string;

    @Column({ type: "varchar", nullable: false })
    type: string;

    @Column({ type: "text", nullable: false })
    message: string;

    @Column({ type: "boolean", default: false })
    isRead: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

    @ManyToOne(() => Users, (user) => user.alarms, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: Users;

    @ManyToOne(() => Article, (article) => article.alarms)
    @JoinColumn({ name: 'articleId' })
    article: Article;
}