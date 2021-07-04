import { Body, Get, Controller, Res, Post, Query } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { LogoutDto } from '@user/dto/logout.dto';
import { UsersService } from '@user/users.service';

@Controller('User')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get('getProfile')
  async getProfile(@Query('id') id: number, @Res() res) {
    const user = await this.userService.findOneById(id);
    return res.json(user);
  }

  @Post('logout')
  @ApiBody({ type: LogoutDto })
  async logout(@Body() data: LogoutDto, @Res() res) {
    const result = await this.userService.removeFCMToken(
      data.userID,
      data.fcmToken,
    );
    if (result === true)
      return res.json({
        valid: true,
        message: 'User has been logged out successfully !',
      });
    else
      return res.json({
        valid: false,
        message: 'An unknown error occured',
      });
  }
}
