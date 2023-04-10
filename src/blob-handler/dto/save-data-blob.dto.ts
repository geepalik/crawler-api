/* eslint-disable prettier/prettier */
import { StylesScriptsDto } from 'src/scraper/dto/styles-scripts.dto';

export interface SaveDataBlobDto {
  screenshot: Buffer;
  styles: StylesScriptsDto;
  scripts: StylesScriptsDto;
}
