import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'User ID' })
  readonly userID: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'FCM Token' })
  readonly fcmToken: string;
}
