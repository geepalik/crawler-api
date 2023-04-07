import { Module } from '@nestjs/common';
import { ScraperManager } from './scraper.manager';
import { ScraperService } from './scraper.service';

@Module({
  providers: [ScraperService, ScraperManager],
  exports: [ScraperManager],
})
export class ScraperModule {}
