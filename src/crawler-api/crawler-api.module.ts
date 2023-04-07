import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Consts from 'src/utils/consts/consts';
import { CrawlerApiController } from './crawler-api.controller';
import { CrawlerApiService } from './crawler-api.service';
import { crawlingData } from './crawling-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Consts.CRAWLING_DATA_NAMES.modelName,
        schema: crawlingData,
      },
    ]),
  ],
  controllers: [CrawlerApiController],
  providers: [CrawlerApiService],
})
export class CrawlerApiModule {}
