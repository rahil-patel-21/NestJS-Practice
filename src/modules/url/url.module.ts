import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { URLController } from './url.controller';
import { DatabaseModule } from '@app/core/database/database.module';
import { URLService } from './url.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
  controllers: [URLController],
  providers: [URLService],
})
export class URLModule {}
