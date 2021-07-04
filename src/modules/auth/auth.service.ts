import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '@user/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, email: string, pass: string) {
    console.log(username, email);
    // find if user exist with this email
    let user = await this.userService.findOneByUsername(username);
    if (!user) {
      user = await this.userService.findOneByEmail(email);
      if (!user) return null;
    }
    // find if user password match
    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }
    const result = user['dataValues'];
    return result;
  }

  public async login(user) {
    const userData = await this.validateUser(
      user.username,
      user.email,
      user.password,
    );
    if (userData) {
      const token = await this.generateToken(user);
      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        token: token,
      };
    } else return null;
  }

  public async create(user) {
    const pass = await this.hashPassword(user.password);

    const newUser = await this.userService.create({
      ...user,
      password: pass,
      id: uuidv4(),
      fcmToken: [user.fcmToken],
    });

    const result = newUser['dataValues'];

    const token = await this.generateToken(result);

    return {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      token: token,
    };
  }
  private async generateToken(user) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  private async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async comparePassword(enteredPassword: string, dbPassword: string) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }
}
