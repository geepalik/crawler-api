/* eslint-disable prettier/prettier */
import { ForbiddenException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { promises as fs } from 'fs';

@Injectable()
export class LocalFileHandlerService {
  async checkIfFileOrDirectoryExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch (error) {
      return false;
    }
  }

  async createFile(
    path: string,
    fileNameFullPath: string,
    data: string | Buffer,
  ): Promise<string> {
    try {
      if (this.checkIfFileOrDirectoryExists(path)) {
        await fs.mkdir(path);
      }
      await fs.writeFile(fileNameFullPath, data);
      return fileNameFullPath;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
