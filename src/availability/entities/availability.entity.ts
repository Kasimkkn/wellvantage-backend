import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';

@Entity('availabilities')
export class Availability {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'user_id' })
    userId: string;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'time', name: 'start_time' })
    startTime: string;

    @Column({ type: 'time', name: 'end_time' })
    endTime: string;

    @Column({ type: 'boolean', name: 'is_recurring', default: false })
    isRecurring: boolean;

    @Column({ name: 'session_name' })
    sessionName: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Booking, (booking) => booking.availability)
    bookings: Booking[];
}