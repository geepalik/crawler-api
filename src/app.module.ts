import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import { CrawlerApiModule } from './crawler-api/crawler-api.module';
import { ScraperModule } from './scraper/scraper.module';
import { BlobHandlerModule } from './blob-handler/blob-handler.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
    }),
    CrawlerApiModule,
    ScraperModule,
    BlobHandlerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
