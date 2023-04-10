import { Injectable } from '@nestjs/common';
import { CrawlerApiDao } from './crawler-api.dao';
import { SaveCrawlDataDto } from './dto/save-crawl-data.dto';

@Injectable()
export class CrawlerApiService {
  constructor(private crawlerApiDao: CrawlerApiDao) {}

  createCrawlingData(saveCrawlData: SaveCrawlDataDto) {
    return this.crawlerApiDao.createCrawlingData(saveCrawlData);
  }
}
