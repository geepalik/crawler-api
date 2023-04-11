/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class HttpApiService {
  constructor(private httpService: HttpService) {}

  private handleBadRequestError(error): void {
    if (error.response?.status === HttpStatus.BAD_REQUEST) {
      throw new BadRequestException(error.response);
    } else if (error.response?.status === HttpStatus.FORBIDDEN) {
      throw new ForbiddenException(error.response);
    } else {
      throw error;
    }
  }

  private async get(url: string, config: unknown): Promise<any> {
    try {
      return this.httpService.axiosRef.get(url, config);
    } catch (error) {
      this.handleBadRequestError(error);
    }
  }

  getRemoteFileContent(url: string): Promise<any> {
    const config = {
      responseType: 'stream',
    };
    return this.get(url, config);
  }
}
