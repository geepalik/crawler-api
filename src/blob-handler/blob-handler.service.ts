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

      //remove directory if already exists
      await this.localFileHandlerService.removeExistingDirectory(
        this.getTargetDirFileFullPath(),
      );

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
  saveScreenshot(contents: Buffer): Promise<string> {
    const fileName = this.websiteName + '_screenshot.png';
    const { filePath, fileNameFullPath } = this.getSaveFileFullPath(fileName);
    return this.localFileHandlerService.createFile(
      filePath,
      fileNameFullPath,
      contents,
    );
  }

  saveInlineLinkAsFile(
    filePath: string,
    fileNameFullPath: string,
    content: string,
  ): Promise<string> {
    return this.localFileHandlerService.createFile(
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

  async saveStyleScriptsData(
    contents: StylesScriptsDto,
    folderType: string,
    fileType: string,
  ): Promise<string[]> {
    //first create folder
    //C:\\node_apps\\crawler-api\\files\\www.sellersnap.io\\styles
    //OR
    //C:\\node_apps\\crawler-api\\files\\www.sellersnap.io\\scripts
    await this.localFileHandlerService.createSubDir(
      this.getTargetDirFileFullPath(`/${folderType}`),
    );

    //links: get remote content for each, save to file, return path
    //inline: save each of them to file, return path
    //call file-handling.service method

    //styles path:
    //"C:\\node_apps\\crawler-api\\files\\www.sellersnap.io\\styles\\1.css"
    //name of file for link
    const results = [];
    let i = 1;
    for (const inlineContent of contents.inline) {
      //define name and full path
      //send to localFileHandlerService.createFile
      //push full path name to array
      const { filePath, fileNameFullPath } = this.getInlineFileName(
        i,
        folderType,
        fileType,
      );
      await this.saveInlineLinkAsFile(
        filePath,
        fileNameFullPath,
        inlineContent,
      );
      results.push(fileNameFullPath);
      i++;
    }

    //TODO below
    //need to read contents of remote link
    //and write to disk as stream
    //const linksContentPromises = [];
    const linkData = [];
    for (const link of contents.links) {
      /*
      linksContentPromises.push(
        this.httpApiService.getContentsAsArrayBuffer(link),
      );
      */
      const data = await this.httpApiService.getContentsAsArrayBuffer(link);
      linkData.push(data);
    }

    //const linkData: any = await Promise.allSettled(linksContentPromises);

    for (const linkDataResponse of linkData) {
      const content = linkDataResponse.data;
      const originalLink = linkDataResponse.request.path;
      const { filePath, fileNameFullPath } = this.getRemoteContentFileName(
        originalLink,
        folderType,
        fileType,
      );
      await this.saveInlineLinkAsFile(filePath, fileNameFullPath, content);
      results.push(fileNameFullPath);
    }

    //return ['path1', 'path2', 'path3'];
    return results;
  }

  //private async getRemoteContent(link: string) {}
}
