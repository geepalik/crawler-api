import { Injectable } from '@nestjs/common';
import { CrawlerApiDao } from './crawler-api.dao';
import { GetCrawlingDataByUrlDto } from './dto/get-crawling-data-by-url.dto';
import { SaveCrawlDataDto } from './dto/save-crawl-data.dto';
import { CrawlingDataModel } from './schemas/crawling-data.schema';
import { MongoServerError } from 'mongodb';
import Consts from 'src/utils/consts/consts';

@Injectable()
export class CrawlerApiService {
  constructor(private crawlerApiDao: CrawlerApiDao) {}

  createCrawlingData(saveCrawlData: SaveCrawlDataDto) {
    return this.crawlerApiDao.createCrawlingData(saveCrawlData);
  }

  getCrawlingData(): Promise<CrawlingDataModel[]> {
    return this.crawlerApiDao.getCrawlingData();
  }

  async getCrawlingDataByUrl(
    payload: GetCrawlingDataByUrlDto,
  ): Promise<CrawlingDataModel> {
    const crawlingData = await this.crawlerApiDao.getCrawlingDataByUrl(payload);
    if (!crawlingData) {
      throw new MongoServerError({
        code: Consts.DATA_DB_NOT_FOUND,
        message: `No data found for the requested URL: ${payload.url}`,
      });
    }
    return crawlingData;
  }
}
