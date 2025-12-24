import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@Controller('availability')
export class AvailabilityController {
    constructor(private readonly availabilityService: AvailabilityService) { }

    @Post()
    create(@Request() req, @Body() createAvailabilityDto: CreateAvailabilityDto) {
        return this.availabilityService.create(req.user.id, createAvailabilityDto);
    }

    @Get()
    findAll(@Request() req, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
        if (startDate && endDate) {
            return this.availabilityService.findByDateRange(
                req.user.id,
                new Date(startDate),
                new Date(endDate),
            );
        }
        return this.availabilityService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.availabilityService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Request() req, @Body() updateAvailabilityDto: UpdateAvailabilityDto) {
        return this.availabilityService.update(id, req.user.id, updateAvailabilityDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.availabilityService.remove(id, req.user.id);
    }
}