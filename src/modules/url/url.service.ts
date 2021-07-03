import { URLModel } from '@app/models/url.model';
import { Injectable } from '@nestjs/common';
import youtubedl from 'youtube-dl-exec';

@Injectable()
export class URLService {
  youtubeLinks = ['https://youtu.be/', 'https://www.youtube.com/watch?'];

  isYoutubeLink(url: string): boolean {
    const result = this.youtubeLinks.some((element) => {
      if (url.toLowerCase().trim().includes(element)) return true;
    });
    return result;
  }

  validateURL(url: string): boolean {
    return this.isYoutubeLink(url);
  }

  async getYtData(url: string): Promise<URLModel> {
    try {
      const urlInfo = await youtubedl(url, {
        dumpSingleJson: true,
        noWarnings: true,
        noCallHome: true,
        noCheckCertificate: true,
        preferFreeFormats: true,
        youtubeSkipDashManifest: true,
        referer: url,
      });
      const urlData = new URLModel();
      urlData.title = urlInfo['title'];
      const thumbnailData = urlInfo['thumbnails'];
      if (thumbnailData) {
        if (thumbnailData.length != 0)
          urlData.thumbnail = thumbnailData[thumbnailData.length - 1]['url'];
      }
      const formats = urlInfo['formats'];
      const audioURLs = [];
      const videoURLs = [];
      for (const index in formats) {
        const data = formats[index];
        if (data['container'] != 'webm_dash' && data['acodec'] != 'none') {
          if (data['ext'] == 'm4a') audioURLs.push(data['url']);
          else videoURLs.push(data['url']);
        }
      }
      urlData.audioURLs = audioURLs;
      urlData.videoURLs = videoURLs;
      return urlData;
    } catch (error) {
      return null;
    }
  }
}
