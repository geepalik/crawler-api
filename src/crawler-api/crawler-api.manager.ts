/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { BlobHandlerManager } from 'src/blob-handler/blob-handler.manager';
import { SaveDataBlobDto } from 'src/blob-handler/dto/save-data-blob.dto';
import { CrawlDataDto } from 'src/scraper/dto/crawl-data.dto';
import { ScraperManager } from 'src/scraper/scraper.manager';
import { CrawlerApiService } from './crawler-api.service';
import { CrawlDto } from './dto/crawl.dto';
import { SaveCrawlDataDto } from './dto/save-crawl-data.dto';

@Injectable()
export class CrawlerApiManager {
  constructor(
    private crawlerApiService: CrawlerApiService,
    private scraperManager: ScraperManager,
    private blobHandlerManager: BlobHandlerManager,
  ) {}

  async crawl(crawlDto: CrawlDto) {
    const { url } = crawlDto;

    //should check if the domain has been crawled already or not
    //get data from db
    //1. if it exists dont crawl
    //2. user a new property, checksum:
    //it is created by making a hash of all the links we get from crawling
    //when first crawling a url, save it to db
    //when crawling, if url is same and checksum is same (no new links have been added)
    //dont crawl and go further, throw error and return message

    const crawlData: CrawlDataDto = await this.scraperManager.getCrawlingData(
      url,
    );

    const saveBlobData: SaveDataBlobDto = {
      url,
      screenshot: crawlData.screenshot,
      styles: crawlData.styles,
      scripts: crawlData.scripts,
    };
    const { screenshot, scripts, stylesheets } =
      await this.blobHandlerManager.saveDataToBlob(saveBlobData);

    const { links, outgoingLinks } = crawlData.urls;

    const saveCrawlData: SaveCrawlDataDto = {
      url,
      screenshot,
      stylesheets,
      scripts,
      links,
      outgoingLinks,
    };
    return this.crawlerApiService.createCrawlingData(saveCrawlData);
  }
}
