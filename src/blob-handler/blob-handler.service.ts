import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { LocalFileHandlerService } from 'src/external-services/local-file-handler.service';
import { StylesScriptsDto } from 'src/scraper/dto/styles-scripts.dto';
import { UrlUtils } from 'src/utils/url-utils';
import { ReturnedBlobDataDto } from './dto/returned-blob-data.dto';
import { SaveDataBlobDto } from './dto/save-data-blob.dto';

@Injectable()
export class BlobHandlerService {
  websiteName: string;

  constructor(
    private localFileHandlerService: LocalFileHandlerService,
    private configService: ConfigService,
  ) {}

  async saveDataToBlob(
    saveDataBlobDto: SaveDataBlobDto,
  ): Promise<ReturnedBlobDataDto> {
    try {
      const { url, screenshot, styles, scripts } = saveDataBlobDto;

      this.websiteName = UrlUtils.getURLHost(url);

      const screenshotPath = await this.saveScreenshot(screenshot);

      const stylesheetsPaths = await this.saveStyleScriptsData(styles);

      const scriptsPaths = await this.saveStyleScriptsData(scripts);

      return {
        screenshot: screenshotPath,
        stylesheets: stylesheetsPaths,
        scripts: scriptsPaths,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  private getSaveFileFullPath(fileName: string): {
    filePath: string;
    fileNameFullPath: string;
  } {
    return {
      filePath: path.join(
        __dirname,
        `../../${this.configService.get<string>('localFilesPath')}/${
          this.websiteName
        }`,
      ),
      fileNameFullPath: path.join(
        __dirname,
        `../../${this.configService.get<string>('localFilesPath')}/${
          this.websiteName
        }/${fileName}`,
      ),
    };
  }

  /**
   * saves screenshot as file
   * format: <domain_of_url_crawled>_screenshot.png
   * @param contents: Buffer
   * @returns {Promise<string>}
   */
  saveScreenshot(contents: Buffer): Promise<string> {
    const fileName = this.websiteName + '_screenshot.png';
    const { filePath, fileNameFullPath } = this.getSaveFileFullPath(fileName);
    return this.localFileHandlerService.createFile(
      filePath,
      fileNameFullPath,
      contents,
    );
  }

  async saveStyleScriptsData(contents: StylesScriptsDto): Promise<string[]> {
    //links: get remote content for each, save to file, return path
    //inline: save each of them to file, return path
    //call file-handling.service method
    return ['path1', 'path2', 'path3'];
  }

  //private async getRemoteContent(link: string) {}
}
