import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findByGoogleId(googleId: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { googleId } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async create(userData: Partial<User>): Promise<User> {
        const user = this.usersRepository.create(userData);
        return this.usersRepository.save(user);
    }

    async update(id: string, userData: Partial<User>): Promise<User> {
        await this.usersRepository.update(id, userData);

        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException(`User ${id} not found`);
        }

        return user;
    }

}