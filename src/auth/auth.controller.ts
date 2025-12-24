import { Controller, Get, UseGuards, Request, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) { }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Request() req, @Response() res) {
        const { access_token } = await this.authService.login(req.user);
        const frontendUrl = this.configService.get<string>('FRONTEND_URL');
        res.redirect(`${frontendUrl}?token=${encodeURIComponent(access_token)}`
        );
    }
}