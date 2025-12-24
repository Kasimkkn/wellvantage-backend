import { IsNotEmpty, IsString, IsDateString, IsEnum } from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {
    @IsNotEmpty()
    @IsString()
    availabilityId: string;

    @IsNotEmpty()
    @IsDateString({}, { message: 'bookingDate must be a valid ISO 8601 string' })
    bookingDate: string;

    @IsNotEmpty()
    @IsString()
    startTime: string;

    @IsNotEmpty()
    @IsString()
    endTime: string;

    @IsEnum(BookingStatus)
    status: BookingStatus = BookingStatus.OPEN;
}
