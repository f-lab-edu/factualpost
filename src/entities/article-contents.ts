import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { ArticleMeta } from './article-meta';

@Entity('article_contents')
export class ArticleContents {
    @PrimaryColumn({ type: 'bigint' })
    articleId: number;

    @Column({ type: 'text', nullable: false })
    contents: string;

    @OneToOne(() => ArticleMeta, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'articleId' })
    article: ArticleMeta;
}
