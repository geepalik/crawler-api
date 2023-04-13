/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class GetCrawlingDatByUrlRequest {
  @ApiProperty()
  url: string;
}
