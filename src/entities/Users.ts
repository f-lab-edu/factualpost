import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { Article } from './Article'
import { Like } from './Like';
import { Alarm } from './Alarm';

@Entity("users")
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", unique: true, nullable: false })
    userId: string;

    @Column({ type: "varchar", nullable: false })
    password: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

    @OneToMany(() => Alarm, (alarm) => alarm.user)
    alarms: Alarm[];

    @OneToMany(() => Like, (like) => like.user)
    likes: Like[];

    @OneToMany(() => Article, (article) => article.user)
    articles: Article[];
}
