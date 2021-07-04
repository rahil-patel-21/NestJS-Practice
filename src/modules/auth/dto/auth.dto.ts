import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, IsEmail, IsOptional } from 'class-validator';

export class AuthDto {
  @MinLength(5)
  @ApiProperty({ type: String, description: 'Username' })
  readonly username: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ type: String, description: 'Email' })
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ type: String, description: 'Password' })
  readonly password: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'FCM Token' })
  readonly fcmToken: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Device ID' })
  readonly deviceID: string;

  @IsNotEmpty()
  @ApiProperty({ enum: ['Android', 'IOS', 'Web'] })
  readonly deviceType: string;
}
