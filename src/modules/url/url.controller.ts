import youtubedl from 'youtube-dl-exec';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { URLModel } from '@models/url.model';

@Controller('url')
export class URLController {
  youtubeLinks = ['https://youtu.be/', 'https://www.youtube.com/watch?'];

  isYoutubeLink(url: string): boolean {
    const result = this.youtubeLinks.some((element) => {
      if (url.toLowerCase().trim().includes(element)) return true;
    });
    return result;
  }

  @Get('getInfo')
  async getInformation(@Query('url') url: string, @Res() res) {
    if (this.isYoutubeLink(url)) {
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
      return res.json({ valid: true, data: urlData });
    } else
      res.json({
        valid: false,
        message: 'Please enter valid url',
      });
  }
}
