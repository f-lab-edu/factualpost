import { 
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    ManyToOne
} from 'typeorm';
import { Users } from './Users';
import { Article } from './Article';

@Entity("likes")
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

    @ManyToOne(() => Users, (user) => user.likes)
    user: Users;

    @ManyToOne(() => Article, (article) => article.likes)
    articles: Article;
}
