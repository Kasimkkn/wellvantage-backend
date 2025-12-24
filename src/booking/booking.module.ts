import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { AvailabilityModule } from '../availability/availability.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Booking]),
        AvailabilityModule,
    ],
    controllers: [BookingController],
    providers: [BookingService],
    exports: [BookingService],
})
export class BookingModule { }