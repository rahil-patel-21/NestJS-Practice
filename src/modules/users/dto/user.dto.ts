import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ type: String, description: 'Username' })
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, description: 'Email' })
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ type: String, description: 'Password' })
  readonly password: string;

  @ApiProperty({ type: String, description: 'Gender -> [male, female]' })
  readonly gender: string;
}
