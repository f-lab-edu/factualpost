import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('users')
export class Users extends BaseEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @Index({ unique: true })
    userId: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    password: string;
}
