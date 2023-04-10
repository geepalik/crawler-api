import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlobHandlerModule } from 'src/blob-handler/blob-handler.module';
import { ScraperModule } from 'src/scraper/scraper.module';
import Consts from 'src/utils/consts/consts';
import { CrawlerApiController } from './crawler-api.controller';
import { CrawlerApiDao } from './crawler-api.dao';
import { CrawlerApiManager } from './crawler-api.manager';
import { CrawlerApiService } from './crawler-api.service';
import { crawlingData } from './schemas/crawling-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Consts.CRAWLING_DATA_NAMES.modelName,
        schema: crawlingData,
      },
    ]),
    ScraperModule,
    BlobHandlerModule,
  ],
  controllers: [CrawlerApiController],
  providers: [CrawlerApiDao, CrawlerApiService, CrawlerApiManager],
})
export class CrawlerApiModule {}
