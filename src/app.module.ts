import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from '@tags/tag.module';
import { DatabaseModule } from './core/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { URLModule } from './modules/url/url.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TagModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    URLModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
