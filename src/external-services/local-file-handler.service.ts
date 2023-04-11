/* eslint-disable prettier/prettier */
import { ForbiddenException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { promises as fs } from 'fs';

@Injectable()
export class LocalFileHandlerService {
  async removeExistingDirectory(path: string) {
    try {
      const dirExists = await this.checkIfFileOrDirectoryExists(path);
      if (dirExists) {
        await fs.rmdir(path, { recursive: true });
      }
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async checkIfFileOrDirectoryExists(path: string): Promise<boolean> {
    try {
      await fs.stat(path);
      return true;
    } catch (error) {
      return false;
    }
  }

  async createSubDir(path: string): Promise<void> {
    try {
      await fs.mkdir(path);
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async createFile(
    path: string,
    fileNameFullPath: string,
    data: string | Buffer,
  ): Promise<string> {
    try {
      const dirExists = await this.checkIfFileOrDirectoryExists(path);
      if (!dirExists) {
        await fs.mkdir(path);
      }
      await fs.writeFile(fileNameFullPath, data);
      return fileNameFullPath;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
