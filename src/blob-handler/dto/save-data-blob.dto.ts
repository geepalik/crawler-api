/* eslint-disable prettier/prettier */
import { StylesScriptsDto } from 'src/scraper/dto/styles-scripts.dto';

export interface SaveDataBlobDto {
  url: string;
  screenshot: Buffer;
  styles: StylesScriptsDto;
  scripts: StylesScriptsDto;
}
