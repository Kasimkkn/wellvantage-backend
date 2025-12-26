import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class UserSeeder implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        await this.seedDefaultUser();
    }

    private async seedDefaultUser() {
        const defaultEmail = 'demo@wellvantage.com';

        // Check if user already exists
        const existingUser = await this.usersRepository.findOne({
            where: { email: defaultEmail },
        });

        if (!existingUser) {
            const defaultUser = this.usersRepository.create({
                email: defaultEmail,
                name: 'Demo User',
                googleId: 'demo-user-id',
                profilePicture: 'https://ui-avatars.com/api/?name=Demo+User',
            });

            await this.usersRepository.save(defaultUser);
            console.log('✅ Default user created:', defaultUser.email);
            console.log('🆔 User ID:', defaultUser.id);
        } else {
            console.log('✅ Default user already exists:', existingUser.email);
            console.log('🆔 User ID:', existingUser.id);
        }
    }
}