import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() user: AuthDto) {
    return await this.authService.login(user);
  }

  @Post('signup')
  async signUp(@Body() user: AuthDto) {
    return await this.authService.create(user);
  }
}
