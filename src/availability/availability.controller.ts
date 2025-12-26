import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { UsersService } from '../users/users.service';

@Controller('availability')
export class AvailabilityController {
    constructor(
        private readonly availabilityService: AvailabilityService,
        private readonly usersService: UsersService, // Inject UsersService
    ) { }

    @Post()
    async create(@Body() createAvailabilityDto: CreateAvailabilityDto) {
        const user = await this.usersService.getDefaultUser();
        return this.availabilityService.create(user.id, createAvailabilityDto);
    }

    @Get()
    async findAll(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
        const user = await this.usersService.getDefaultUser();
        if (startDate && endDate) {
            return this.availabilityService.findByDateRange(
                user.id,
                new Date(startDate),
                new Date(endDate),
            );
        }
        return this.availabilityService.findAll(user.id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.getDefaultUser();
        return this.availabilityService.findOne(id, user.id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateAvailabilityDto: UpdateAvailabilityDto) {
        const user = await this.usersService.getDefaultUser();
        return this.availabilityService.update(id, user.id, updateAvailabilityDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const user = await this.usersService.getDefaultUser();
        return this.availabilityService.remove(id, user.id);
    }
}