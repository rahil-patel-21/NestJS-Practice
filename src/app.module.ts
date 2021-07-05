import { Module } from '@nestjs/common';
import { URLModule } from '@url/url.module';
import { TagModule } from '@tags/tag.module';
import { AppService } from '@app/app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@user/users.module';
import { AppController } from '@app/app.controller';
import { DatabaseModule } from '@core/database/database.module';
import { NotificationModule } from '@notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TagModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    URLModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
