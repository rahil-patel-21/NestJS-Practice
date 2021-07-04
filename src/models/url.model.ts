export class URLModel {
  title?: string;
  thumbnail?: string;
  audioURLs: string[];
  videoURLs: string[];

  constructor(
    title?: string,
    thumbnail?: string,
    audioURLs?: string[],
    videoURLs?: string[],
  ) {
    this.title = title;
    this.thumbnail = thumbnail;
    this.audioURLs = audioURLs;
    this.videoURLs = videoURLs;
  }
}
