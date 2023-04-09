/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CrawlDataDto } from 'src/scraper/dto/crawl-data.dto';
import { ScraperManager } from 'src/scraper/scraper.manager';
import { CrawlDto } from './dto/crawl.dto';

@Injectable()
export class CrawlerApiManager {
  constructor(private scraperManager: ScraperManager) {}

  async crawl(crawlDto: CrawlDto) {
    const { url } = crawlDto;
    const crawlData: CrawlDataDto = await this.scraperManager.getCrawlingData(
      url,
    );
    //call blob handler here
    //saveBlobData
    //accepts
    //{screenshot: Buffer, styles: {inline: [], links:[]}, scripts: {inline: [], links: []} }
    //to save screenshot, styles and scripts into blob
    //and return links
    return crawlData;
  }
}
