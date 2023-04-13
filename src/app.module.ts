/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import { CrawlerApiModule } from './crawler-api/crawler-api.module';
import { ScraperModule } from './scraper/scraper.module';
import { BlobHandlerModule } from './blob-handler/blob-handler.module';
import { ExternalServicesModule } from './external-services/external-services.module';
import config from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('databaseContainerURL'),
      }),
    }),
    CrawlerApiModule,
    ScraperModule,
    BlobHandlerModule,
    ExternalServicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
