import { Cron } from '@nestjs/schedule';
import { AuthDto } from '@auth/dto/auth.dto';
import { AuthService } from '@auth/auth.service';
import { Controller, Body, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Cron('1 0 1 * * *')
  startCron() {
    console.log('Cron triggered !');
  }

  @Post('login')
  async login(@Body() user: AuthDto) {
    return await this.authService.login(user);
  }

  @Post('signup')
  async signUp(@Body() user: AuthDto) {
    return await this.authService.create(user);
  }
}
