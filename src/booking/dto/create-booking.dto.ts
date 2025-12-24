import { IsNotEmpty, IsString, IsDateString, IsEnum } from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {
    @IsNotEmpty()
    @IsString()
    availabilityId: string;

    @IsNotEmpty()
    @IsDateString()
    bookingDate: Date;

    @IsNotEmpty()
    @IsString()
    startTime: string;

    @IsNotEmpty()
    @IsString()
    endTime: string;

    @IsEnum(BookingStatus)
    status: BookingStatus = BookingStatus.OPEN;
}