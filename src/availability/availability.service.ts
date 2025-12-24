import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Availability } from './entities/availability.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@Injectable()
export class AvailabilityService {
    constructor(
        @InjectRepository(Availability)
        private availabilityRepository: Repository<Availability>,
    ) { }

    async create(userId: string, createAvailabilityDto: CreateAvailabilityDto): Promise<Availability> {
        const availability = this.availabilityRepository.create({
            ...createAvailabilityDto,
            userId,
        });
        return this.availabilityRepository.save(availability);
    }

    async findAll(userId: string): Promise<Availability[]> {
        return this.availabilityRepository.find({
            where: { userId },
            order: { date: 'ASC', startTime: 'ASC' },
        });
    }

    async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Availability[]> {
        return this.availabilityRepository.find({
            where: {
                userId,
                date: Between(startDate, endDate),
            },
            order: { date: 'ASC', startTime: 'ASC' },
        });
    }

    async findOne(id: string, userId: string): Promise<Availability> {
        const availability = await this.availabilityRepository.findOne({
            where: { id, userId },
        });

        if (!availability) {
            throw new NotFoundException(`Availability with ID ${id} not found`);
        }

        return availability;
    }

    async update(id: string, userId: string, updateAvailabilityDto: UpdateAvailabilityDto): Promise<Availability> {
        const availability = await this.findOne(id, userId);

        Object.assign(availability, updateAvailabilityDto);
        return this.availabilityRepository.save(availability);
    }

    async remove(id: string, userId: string): Promise<void> {
        const availability = await this.findOne(id, userId);
        await this.availabilityRepository.remove(availability);
    }
}