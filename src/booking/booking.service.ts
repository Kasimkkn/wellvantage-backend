import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AvailabilityService } from '../availability/availability.service';

@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
        private availabilityService: AvailabilityService,
    ) { }

    async create(userId: string, createBookingDto: CreateBookingDto): Promise<Booking> {
        // Verify availability exists
        const availability = await this.availabilityService.findOne(
            createBookingDto.availabilityId,
            userId,
        );

        // Check if slot is already booked
        const existingBooking = await this.bookingRepository.findOne({
            where: {
                availabilityId: createBookingDto.availabilityId,
                bookingDate: createBookingDto.bookingDate,
                startTime: createBookingDto.startTime,
                status: BookingStatus.BOOKED,
            },
        });

        if (existingBooking) {
            throw new BadRequestException('This time slot is already booked');
        }

        const booking = this.bookingRepository.create({
            ...createBookingDto,
            userId,
        });

        return this.bookingRepository.save(booking);
    }

    async findAllByUser(userId: string): Promise<Booking[]> {
        return this.bookingRepository.find({
            where: { userId },
            relations: ['availability', 'availability.user'],
            order: { bookingDate: 'ASC', startTime: 'ASC' },
        });
    }

    async findAllByAvailability(availabilityId: string): Promise<Booking[]> {
        return this.bookingRepository.find({
            where: { availabilityId },
            relations: ['user'],
            order: { bookingDate: 'ASC', startTime: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Booking> {
        const booking = await this.bookingRepository.findOne({
            where: { id },
            relations: ['availability', 'user'],
        });

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }

        return booking;
    }

    async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
        const booking = await this.findOne(id);
        booking.status = status;
        return this.bookingRepository.save(booking);
    }

    async remove(id: string, userId: string): Promise<void> {
        const booking = await this.bookingRepository.findOne({
            where: { id, userId },
        });

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }

        await this.bookingRepository.remove(booking);
    }
}