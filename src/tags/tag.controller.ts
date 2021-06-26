import { Controller, Get } from '@nestjs/common';
import { TagService } from '@tags/tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}
  @Get('getAllTags')
  getTags() {
    return this.tagService.allTags();
  }
}
