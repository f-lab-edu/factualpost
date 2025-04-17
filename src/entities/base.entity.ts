import { 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    DeleteDateColumn 
} from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn({ type: 'timestamp', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', precision: 6, nullable: true, default: null })
    deletedAt: Date;
}
