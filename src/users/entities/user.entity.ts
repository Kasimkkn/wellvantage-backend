import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Availability } from '../../availability/entities/availability.entity';
import { Booking } from '../../booking/entities/booking.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column({ unique: true, name: 'google_id' })
    googleId: string;

    @Column({ nullable: true, name: 'profile_picture' })
    profilePicture: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Availability, (availability) => availability.user)
    availabilities: Availability[];

    @OneToMany(() => Booking, (booking) => booking.user)
    bookings: Booking[];
}