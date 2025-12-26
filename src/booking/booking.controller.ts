import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { UsersService } from '../users/users.service';

@Controller('booking')
export class BookingController {
    constructor(
        private readonly bookingService: BookingService,
        private readonly usersService: UsersService,
    ) { }

    @Post()
    async create(@Body() createBookingDto: CreateBookingDto) {
        const user = await this.usersService.getDefaultUser();
        return this.bookingService.create(user.id, createBookingDto);
    }

    @Get()
    async findAllByUser() {
        const user = await this.usersService.getDefaultUser();
        return this.bookingService.findAllByUser(user.id);
    }

    @Get('availability/:availabilityId')
    async findAllByAvailability(@Param('availabilityId') availabilityId: string) {
        return this.bookingService.findAllByAvailability(availabilityId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.bookingService.findOne(id);
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body() updateBookingStatusDto: UpdateBookingStatusDto) {
        return this.bookingService.updateStatus(id, updateBookingStatusDto.status);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const user = await this.usersService.getDefaultUser();
        return this.bookingService.remove(id, user.id);
    }
}