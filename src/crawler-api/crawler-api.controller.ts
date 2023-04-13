/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common';
import { MongoDbExceptionFilter } from 'src/utils/filters/mongodb-exceptions.filter';
import { JoiValidationPipe } from 'src/utils/validations/joi-validation.pipe';
import { CrawlerApiManager } from './crawler-api.manager';
import { CrawlRequest } from './dto/request/crawl.request';
import { GetCrawlingDatByUrlRequest } from './dto/request/get-crawling-data-by-url.request';
import { CrawlValidations } from './dto/validations/crawl.validations';
import { GetCrawlingDataByValidations } from './dto/validations/get-crawling-data-by-url.validations';

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

  @Get('crawling-data')
  getCrawls() {
    return this.crawlerApiManager.getCrawlingData();
  }

  @Get('crawling-data/:url')
  @UseFilters(MongoDbExceptionFilter)
  getCrawlByUrl(
    @Param(
      new JoiValidationPipe(
        GetCrawlingDataByValidations.getCrawlingDataByIdValidator(),
      ),
    )
    getCrawlingDataRequest: GetCrawlingDatByUrlRequest,
  ) {
    return this.crawlerApiManager.getCrawlingDataByUrl(getCrawlingDataRequest);
  }
}
