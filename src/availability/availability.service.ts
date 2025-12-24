import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Availability } from './entities/availability.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@Injectable()
export class AvailabilityService {
    constructor(
        @InjectRepository(Availability)
        private readonly availabilityRepo: Repository<Availability>,
    ) { }

    async create(
        userId: string,
        dto: CreateAvailabilityDto,
    ): Promise<Availability> {
        try {
            const availability = this.availabilityRepo.create({
                ...dto,
                userId,
            });

            return await this.availabilityRepo.save(availability);
        } catch (error) {
            throw new InternalServerErrorException(
                'Unable to create availability',
            );
        }
    }

    async findAll(userId: string): Promise<Availability[]> {
        return this.availabilityRepo.find({
            where: { userId },
            order: {
                date: 'ASC',
                startTime: 'ASC',
            },
        });
    }

    async findByDateRange(
        userId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<Availability[]> {
        if (startDate > endDate) {
            throw new BadRequestException(
                'startDate must be before endDate',
            );
        }

        return this.availabilityRepo.find({
            where: {
                userId,
                date: Between(startDate, endDate),
            },
            order: {
                date: 'ASC',
                startTime: 'ASC',
            },
        });
    }

    async findOne(
        id: string,
        userId: string,
    ): Promise<Availability> {
        const availability = await this.availabilityRepo.findOne({
            where: { id, userId },
        });

        if (!availability) {
            throw new NotFoundException(
                'Availability not found',
            );
        }

        return availability;
    }

    async update(
        id: string,
        userId: string,
        dto: UpdateAvailabilityDto,
    ): Promise<Availability> {
        const availability = await this.findOne(id, userId);

        Object.assign(availability, dto);

        try {
            return await this.availabilityRepo.save(availability);
        } catch {
            throw new InternalServerErrorException(
                'Unable to update availability',
            );
        }
    }

    async remove(
        id: string,
        userId: string,
    ): Promise<void> {
        const availability = await this.findOne(id, userId);

        const result = await this.availabilityRepo.delete(availability.id);

        if (result.affected === 0) {
            throw new InternalServerErrorException(
                'Failed to delete availability',
            );
        }
    }
}
