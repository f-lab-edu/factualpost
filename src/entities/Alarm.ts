import { Entity, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Users } from './Users';

@Entity("alarms")
export class Alarm {
    @PrimaryGeneratedColumn()
    id: number;

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
}
