import { Controller, Get, Query, Res } from '@nestjs/common';
import { URLService } from '@url/url.service';

@Controller('url')
export class URLController {
  constructor(private readonly urlService: URLService) {}

  @Get('getInfo')
  async getInformation(@Query('url') url: string, @Res() res) {
    if (this.urlService.validateURL(url)) {
      const urlData = await this.urlService.getYtData(url);
      return res.json({ valid: true, data: urlData });
    } else
      res.json({
        valid: false,
        message: 'Please enter valid url',
      });
  }
}
