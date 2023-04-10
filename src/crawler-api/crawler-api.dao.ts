/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Consts from 'src/utils/consts/consts';
import { SaveCrawlDataDto } from './dto/save-crawl-data.dto';
import { CrawlingDataModel } from './schemas/crawling-data.schema';

@Injectable()
export class CrawlerApiDao {
  constructor(
    @InjectModel(Consts.CRAWLING_DATA_NAMES.modelName)
    private readonly crawlingDataModel: Model<CrawlingDataModel>,
  ) {}

  createCrawlingData(payload: SaveCrawlDataDto) {
    const crawlingData = new this.crawlingDataModel(payload);
    return crawlingData.save();
  }
}
