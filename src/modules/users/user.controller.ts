import { Controller, Post, Body } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('User')
export class UserController {
  constructor(private userService: UsersService) {}
  @Post('Create')
  async getTags(@Body() data: UserDto): Promise<User> {
    const emailUser = await this.userService.findOneByEmail('1sssd2');
    return emailUser;
  }
}
