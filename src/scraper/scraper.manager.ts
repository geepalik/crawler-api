/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Injectable()
export class ScraperManager {
  constructor(private scraperService: ScraperService) {}
}
