import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET')!,
                signOptions: {
                    expiresIn: configService.get<number>('JWT_EXPIRATION', 3600),

                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy],
    exports: [AuthService],
})
export class AuthModule { }