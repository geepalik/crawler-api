/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CrawlDto } from './dto/crawl.dto';

@Injectable()
export class CrawlerApiManager {
  async crawl(crawlDto: CrawlDto) {
    return 'OK!';
  }
}
