import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Request,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }

    @Post()
    create(@Request() req, @Body() dto: CreateBookingDto) {
        return this.bookingService.create(req.user.id, dto);
    }

    @Get()
    findAllByUser(@Request() req) {
        return this.bookingService.findAllByUser(req.user.id);
    }

    @Get('availability/:availabilityId')
    findAllByAvailability(
        @Param('availabilityId', new ParseUUIDPipe()) availabilityId: string,
    ) {
        return this.bookingService.findAllByAvailability(availabilityId);
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.bookingService.findOne(id);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateBookingStatusDto,
    ) {
        return this.bookingService.updateStatus(id, dto.status);
    }

    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
        return this.bookingService.remove(id, req.user.id);
    }
}
