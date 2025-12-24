import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateGoogleUser(profile: any): Promise<User> {
        const { id, emails, displayName, photos } = profile;
        const email = emails[0].value;
        const profilePicture = photos[0]?.value;

        let user = await this.usersService.findByGoogleId(id);

        if (!user) {
            user = await this.usersService.create({
                googleId: id,
                email,
                name: displayName,
                profilePicture,
            });
        }

        return user;
    }

    async login(user: User) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                profilePicture: user.profilePicture,
            },
        };
    }
}