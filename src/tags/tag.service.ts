import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
  allTags(): string[] {
    return ['tagA', 'tagB'];
  }
}
