import { IsNotEmpty, IsString, IsBoolean, IsDateString } from 'class-validator';

export class CreateAvailabilityDto {
    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsNotEmpty()
    @IsString()
    startTime: string;

    @IsNotEmpty()
    @IsString()
    endTime: string;

    @IsNotEmpty()
    @IsBoolean()
    isRecurring: boolean;

    @IsNotEmpty()
    @IsString()
    sessionName: string;
}
