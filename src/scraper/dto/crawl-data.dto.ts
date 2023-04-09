/* eslint-disable prettier/prettier */
import { LinksDto } from './links.dto';
import { StylesScriptsDto } from './styles-scripts.dto';

export interface CrawlDataDto {
  screenshot: Buffer;
  urls: LinksDto;
  styles: StylesScriptsDto;
  scripts: StylesScriptsDto;
}
