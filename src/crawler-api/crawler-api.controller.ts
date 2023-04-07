import { Body, Controller, Post } from '@nestjs/common';
import { JoiValidationPipe } from 'src/utils/validations/joi-validation.pipe';
import { CrawlerApiManager } from './crawler-api.manager';
import { CrawlRequest } from './dto/request/crawl.request';
import { CrawlValidations } from './dto/validations/crawl.validations';

@Controller('crawler-api')
export class CrawlerApiController {
  constructor(private crawlerApiManager: CrawlerApiManager) {}

  @Post('crawl')
  crawl(
    @Body(new JoiValidationPipe(CrawlValidations.crawlValidator()))
    crawlRequest: CrawlRequest,
  ) {
    return this.crawlerApiManager.crawl(crawlRequest);
  }
}
