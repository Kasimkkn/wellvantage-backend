import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Availability } from '../../availability/entities/availability.entity';

export enum BookingStatus {
    OPEN = 'open',
    BOOKED = 'booked',
    CANCELLED = 'cancelled',
}

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'availability_id' })
    availabilityId: string;

    @Column({ type: 'uuid', name: 'user_id' })
    userId: string;

    @Column({ type: 'date', name: 'booking_date' })
    bookingDate: string;

    @Column({ type: 'time', name: 'start_time' })
    startTime: string;

    @Column({ type: 'time', name: 'end_time' })
    endTime: string;

    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.OPEN,
    })
    status: BookingStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Availability, (availability) => availability.bookings)
    @JoinColumn({ name: 'availability_id' })
    availability: Availability;

    @ManyToOne(() => User, (user) => user.bookings)
    @JoinColumn({ name: 'user_id' })
    user: User;
}