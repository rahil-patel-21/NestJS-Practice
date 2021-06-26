import { Module } from '@nestjs/common';
import { TagController } from '@tags/tag.controller';
import { TagService } from '@tags/tag.service';

@Module({
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
