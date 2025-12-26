import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { AvailabilityModule } from '../availability/availability.module';
import { UsersModule } from '../users/users.module'; // Import UsersModule

@Module({
    imports: [
        TypeOrmModule.forFeature([Booking]),
        AvailabilityModule,
        UsersModule, // Add this
    ],
    controllers: [BookingController],
    providers: [BookingService],
    exports: [BookingService],
})
export class BookingModule { }