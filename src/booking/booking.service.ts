import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AvailabilityService } from '../availability/availability.service';

@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepository: Repository<Booking>,
        private readonly availabilityService: AvailabilityService,
    ) { }

    async create(userId: string, dto: CreateBookingDto): Promise<Booking> {

        const bookingDate = dto.bookingDate;
        const overlappingBooking = await this.bookingRepository
            .createQueryBuilder('booking')
            .where('booking.availabilityId = :availabilityId', { availabilityId: dto.availabilityId })
            .andWhere('booking.bookingDate = :bookingDate', { bookingDate })
            .andWhere('booking.status != :cancelled', { cancelled: 'cancelled' }) // any non-cancelled booking counts
            .andWhere('booking.startTime < :endTime AND booking.endTime > :startTime', {
                startTime: dto.startTime,
                endTime: dto.endTime,
            })
            .getOne();

        if (overlappingBooking) {
            throw new BadRequestException('This time slot is already booked');
        }

        try {
            const booking = this.bookingRepository.create({
                ...dto,
                userId,
                status: BookingStatus.BOOKED,
            });

            return await this.bookingRepository.save(booking);
        } catch (error) {
            console.error('Booking creation error:', error);
            throw new InternalServerErrorException('Failed to create booking');
        }
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

    async updateStatus(
        id: string,
        status: BookingStatus,
    ): Promise<Booking> {
        const booking = await this.findOne(id);
        booking.status = status;

        try {
            return await this.bookingRepository.save(booking);
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to update booking status',
            );
        }
    }

    async remove(id: string, userId: string): Promise<void> {
        const booking = await this.bookingRepository.findOne({
            where: { id, userId },
        });

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }

        try {
            await this.bookingRepository.remove(booking);
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete booking');
        }
    }
}
