export class URLModel {
  title?: string;
  thumbnail: string;

  constructor(title?: string, thumbnail?: string) {
    this.title = title;
    this.thumbnail = thumbnail;
  }
}
