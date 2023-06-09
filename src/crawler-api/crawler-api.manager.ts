/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { BlobHandlerManager } from 'src/blob-handler/blob-handler.manager';
import { SaveDataBlobDto } from 'src/blob-handler/dto/save-data-blob.dto';
import { CrawlDataDto } from 'src/scraper/dto/crawl-data.dto';
import { ScraperManager } from 'src/scraper/scraper.manager';
import { CrawlerApiService } from './crawler-api.service';
import { CrawlDto } from './dto/crawl.dto';
import { GetCrawlingDataByUrlDto } from './dto/get-crawling-data-by-url.dto';
import { SaveCrawlDataDto } from './dto/save-crawl-data.dto';
import { CrawlingDataModel } from './schemas/crawling-data.schema';

@Injectable()
export class CrawlerApiManager {
  constructor(
    private crawlerApiService: CrawlerApiService,
    private scraperManager: ScraperManager,
    private blobHandlerManager: BlobHandlerManager,
  ) {}

  async crawl(crawlDto: CrawlDto) {
    const { url } = crawlDto;

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

  getCrawlingData(): Promise<CrawlingDataModel[]> {
    return this.crawlerApiService.getCrawlingData();
  }

  getCrawlingDataByUrl(
    payload: GetCrawlingDataByUrlDto,
  ): Promise<CrawlingDataModel> {
    return this.crawlerApiService.getCrawlingDataByUrl(payload);
  }
}
