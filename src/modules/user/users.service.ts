import { User } from '@user/user.entity';
import { Injectable, Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '@core/constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(user: any): Promise<User> {
    return await this.userRepository.create<User>(user);
  }

  async update(user: User, id: any): Promise<any> {
    return await this.userRepository.update(user, { where: { id } });
  }

  async findOneById(id: any): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { username } });
  }

  async removeFCMToken(id: string, fcmToken: string) {
    try {
      const user = await this.findOneById(id);
      if (user) {
        user.fcmToken.forEach((item, index) => {
          if (item === fcmToken) user.fcmToken.splice(index, 1);
        });
        const data = await this.update(user['dataValues'], id);
        if (data) return true;
        else return false;
      } else return false;
    } catch (error) {
      return false;
    }
  }
}
