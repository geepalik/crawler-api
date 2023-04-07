/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CrawlRequest {
  @ApiProperty()
  url: string;
}
