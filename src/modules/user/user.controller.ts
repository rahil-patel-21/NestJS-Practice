import { Get, Controller, Res, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('User')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get('getProfile')
  async getProfile(@Query('id') id: number, @Res() res) {
    const user = await this.userService.findOneById(id);
    return res.json(user);
  }
}
