/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { HttpApiService } from 'src/external-services/http-api.service';
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
    private httpApiService: HttpApiService,
    private configService: ConfigService,
  ) {}

  async saveDataToBlob(
    saveDataBlobDto: SaveDataBlobDto,
  ): Promise<ReturnedBlobDataDto> {
    try {
      const { url, screenshot, styles, scripts } = saveDataBlobDto;

      this.websiteName = UrlUtils.getURLHost(url);

      await this.initFilesDir();

      const screenshotPath = await this.saveScreenshot(screenshot);

      const stylesheetsPaths = await this.saveStyleScriptsData(
        styles,
        'styles',
        'css',
      );

      const scriptsPaths = await this.saveStyleScriptsData(
        scripts,
        'scripts',
        'js',
      );

      return {
        screenshot: screenshotPath,
        stylesheets: stylesheetsPaths,
        scripts: scriptsPaths,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  private async initFilesDir(): Promise<void>{
    const filesPath = path.join(__dirname,`../../${this.configService.get<string>('localFilesPath')}`);
    await this.localFileHandlerService.initRootDirectory(filesPath);
    await this.removecurrentURLExistingDirectory();
  }

  /**
   * remove directory if already exists for incoming url
   */
  private async removecurrentURLExistingDirectory(): Promise<void> {
    await this.localFileHandlerService.removeExistingDirectory(
      this.getTargetDirFileFullPath(),
    );
  }

  /**
   *
   * @param extraPath
   * @returns
   */
  private getTargetDirFileFullPath(extraPath?: string): string {
    extraPath = extraPath || '';
    return path.join(
      __dirname,
      `../../${this.configService.get<string>('localFilesPath')}/${
        this.websiteName
      }${extraPath}`,
    );
  }

  private getSaveFileFullPath(fileName: string): {
    filePath: string;
    fileNameFullPath: string;
  } {
    return {
      filePath: this.getTargetDirFileFullPath(),
      fileNameFullPath: this.getTargetDirFileFullPath(`/${fileName}`),
    };
  }

  /**
   * saves screenshot as file
   * format: <domain_of_url_crawled>_screenshot.png
   * @param contents: Buffer
   * @returns {Promise<string>}
   */
  async saveScreenshot(contents: Buffer): Promise<string> {
    const fileName = this.websiteName + '_screenshot.png';
    const { filePath, fileNameFullPath } = this.getSaveFileFullPath(fileName);
    await this.localFileHandlerService.createFile(
      filePath,
      fileNameFullPath,
      contents,
    );
    return fileNameFullPath;
  }

  private async saveInlinesFile(
    filePath: string,
    fileNameFullPath: string,
    content: string,
  ): Promise<void> {
    await this.localFileHandlerService.createFile(
      filePath,
      fileNameFullPath,
      content,
    );
  }

  private async saveLinkAsFile(
    filePath: string,
    fileNameFullPath: string,
    content: any,
  ): Promise<void> {
    await this.localFileHandlerService.saveStreamToFile(
      filePath,
      fileNameFullPath,
      content,
    );
  }

  private getInlineFileName(
    i: number,
    folderType: string,
    fileType: string,
  ): {
    filePath: string;
    fileNameFullPath: string;
  } {
    return {
      filePath: this.getTargetDirFileFullPath(`/${folderType}/inline`),
      fileNameFullPath: this.getTargetDirFileFullPath(
        `/${folderType}/inline/${i}.${fileType}`,
      ),
    };
  }

  private getRemoteContentFileName(
    fileName: string,
    folderType: string,
    fileType: string,
  ): {
    filePath: string;
    fileNameFullPath: string;
  } {
    return {
      filePath: this.getTargetDirFileFullPath(`/${folderType}/links`),
      fileNameFullPath: this.getTargetDirFileFullPath(
        `/${folderType}/links/${fileName}.${fileType}`,
      ),
    };
  }

  private getRemoteContent(link: string): Promise<any> {
    return this.httpApiService.getRemoteFileContent(link);
  }

  /**
   * create sub dir for the current folder type
   * e.g. host/scripts
   * @param folderType
   */
  private async createSubDir(folderType: string): Promise<void> {
    await this.localFileHandlerService.createDir(
      this.getTargetDirFileFullPath(`/${folderType}`),
    );
  }

  async saveStyleScriptsData(
    contents: StylesScriptsDto,
    folderType: string,
    fileType: string,
  ): Promise<string[]> {
    await this.createSubDir(folderType);

    const results = [];
    let i = 1;
    for (const inlineContent of contents.inline) {
      const { filePath, fileNameFullPath } = this.getInlineFileName(
        i,
        folderType,
        fileType,
      );
      await this.saveInlinesFile(filePath, fileNameFullPath, inlineContent);
      results.push(fileNameFullPath);
      i++;
    }

    for (const link of contents.links) {
      try {
        const data = await this.getRemoteContent(link);
        const { filePath, fileNameFullPath } = this.getRemoteContentFileName(
          UrlUtils.getURLFileName(link),
          folderType,
          fileType,
        );
        await this.saveLinkAsFile(filePath, fileNameFullPath, data);
        results.push(fileNameFullPath);
      } catch (error) {
        //TODO: Proper Logging w/ winston through module and service
        console.log(
          `Error getting data from link: ${link} for website ${this.websiteName}: ${error.message}`,
        );
      }
    }
    return results;
  }
}
