import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { Availability } from './entities/availability.entity';
import { UsersModule } from '../users/users.module'; // Import UsersModule

@Module({
    imports: [
        TypeOrmModule.forFeature([Availability]),
        UsersModule, // Add this
    ],
    controllers: [AvailabilityController],
    providers: [AvailabilityService],
    exports: [AvailabilityService],
})
export class AvailabilityModule { }