import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AvailabilityModule } from './availability/availability.module';
import { BookingModule } from './booking/booking.module';
import { User } from './users/entities/user.entity';
import { Availability } from './availability/entities/availability.entity';
import { Booking } from './booking/entities/booking.entity';
import { UserSeeder } from './database/seeders/user.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true, // dev only
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]), // Add this for seeder
    UsersModule,
    AvailabilityModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserSeeder], // Add UserSeeder here
})
export class AppModule { }