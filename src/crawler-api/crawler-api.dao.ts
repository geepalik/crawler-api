/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Consts from 'src/utils/consts/consts';
import { GetCrawlingDataByUrlDto } from './dto/get-crawling-data-by-url.dto';
import { SaveCrawlDataDto } from './dto/save-crawl-data.dto';
import { CrawlingDataModel } from './schemas/crawling-data.schema';

@Injectable()
export class CrawlerApiDao {
  constructor(
    @InjectModel(Consts.CRAWLING_DATA_NAMES.modelName)
    private readonly crawlingDataModel: Model<CrawlingDataModel>,
  ) {}

  getCrawlingData(): Promise<CrawlingDataModel[]> {
    return this.crawlingDataModel.find();
  }

  getCrawlingDataByUrl(
    payload: GetCrawlingDataByUrlDto,
  ): Promise<CrawlingDataModel> {
    return this.crawlingDataModel.findOne({ url: payload.url });
  }

  /**
   * creates new document in crawlingData collection for a URL
   * if it already exists in collection, it will update the document with data it crawled
   */
  createCrawlingData(payload: SaveCrawlDataDto): Promise<CrawlingDataModel> {
    const { url, screenshot, stylesheets, scripts, links, outgoingLinks } =
      payload;

    return this.crawlingDataModel.findOneAndUpdate(
      { url },
      { screenshot, stylesheets, scripts, links, outgoingLinks },
      { upsert: true, new: true },
    );
  }
}
