import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn } from 'typeorm';
import { Users } from './Users';
import { Like } from './Like';

@Entity('articles')
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'text' })
    contents: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

    @ManyToOne(() => Users, (user) => user.articles, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: Users;

    @OneToMany(() => Like, (like) => like.article)
    likes: Like[];
}
