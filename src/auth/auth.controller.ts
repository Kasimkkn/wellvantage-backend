import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('google/verify')
    async googleVerify(@Body() body: {
        googleId: string;
        email: string;
        name: string;
        profilePicture?: string;
        accessToken: string;
    }) {
        const user = await this.authService.validateGoogleUser({
            id: body.googleId,
            emails: [{ value: body.email }],
            displayName: body.name,
            photos: body.profilePicture ? [{ value: body.profilePicture }] : [],
        });

        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Request() req) {
        return req.user;
    }
}