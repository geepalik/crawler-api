/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CrawlDataDto } from './dto/crawl-data.dto';
import { ScraperService } from './scraper.service';

@Injectable()
export class ScraperManager {
  constructor(private scraperService: ScraperService) {}

  getCrawlingData(url: string): Promise<CrawlDataDto> {
    return this.scraperService.getCrawlingData(url);
  }
}
