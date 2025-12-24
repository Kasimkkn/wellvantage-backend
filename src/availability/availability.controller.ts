import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('availability')
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
    constructor(private readonly availabilityService: AvailabilityService) { }

    @Post()
    create(@Request() req, @Body() dto: CreateAvailabilityDto) {
        if (!req.user?.id) {
            throw new BadRequestException('Invalid user');
        }
        return this.availabilityService.create(req.user.id, dto);
    }

    @Get()
    async findAll(
        @Request() req,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new BadRequestException('Invalid date format');
            }

            if (start > end) {
                throw new BadRequestException('startDate must be before endDate');
            }

            return this.availabilityService.findByDateRange(req.user.id, start, end);
        }

        return this.availabilityService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Request() req,
    ) {
        return this.availabilityService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Request() req,
        @Body() dto: UpdateAvailabilityDto,
    ) {
        if (Object.keys(dto).length === 0) {
            throw new BadRequestException('At least one field must be updated');
        }
        return this.availabilityService.update(id, req.user.id, dto);
    }

    @Delete(':id')
    remove(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Request() req,
    ) {
        return this.availabilityService.remove(id, req.user.id);
    }
}
