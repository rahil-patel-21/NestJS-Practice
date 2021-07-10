import { Module } from '@nestjs/common';
import { URLModule } from '@url/url.module';
import { TagModule } from '@tags/tag.module';
import { AppService } from '@app/app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@user/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from '@app/app.controller';
import { StatementModule } from '@statement/statement.module';
import { DatabaseModule } from '@core/database/database.module';
import { NotificationModule } from '@notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TagModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    URLModule,
    NotificationModule,
    StatementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
