/* eslint-disable prettier/prettier */
import { ForbiddenException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import * as fs from 'fs';

@Injectable()
export class LocalFileHandlerService {
  async removeExistingDirectory(path: string) {
    try {
      const dirExists = await this.checkIfFileOrDirectoryExists(path);
      if (dirExists) {
        await fs.promises.rmdir(path, { recursive: true });
      }
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async checkIfFileOrDirectoryExists(path: string): Promise<boolean> {
    try {
      await fs.promises.stat(path);
      return true;
    } catch (error) {
      return false;
    }
  }

  async createSubDir(path: string): Promise<void> {
    try {
      await fs.promises.mkdir(path);
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async createFile(
    path: string,
    fileNameFullPath: string,
    data: string | Buffer,
  ): Promise<void> {
    try {
      const dirExists = await this.checkIfFileOrDirectoryExists(path);
      if (!dirExists) {
        await fs.promises.mkdir(path);
      }
      await fs.promises.writeFile(fileNameFullPath, data);
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async saveStreamToFile(
    path: string,
    fileNameFullPath: string,
    streamResult: any,
  ): Promise<void> {
    try {
      const dirExists = await this.checkIfFileOrDirectoryExists(path);
      if (!dirExists) {
        await fs.promises.mkdir(path);
      }
      const writer = fs.createWriteStream(fileNameFullPath);
      streamResult.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
