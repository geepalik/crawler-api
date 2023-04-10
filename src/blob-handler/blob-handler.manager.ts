/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { BlobHandlerService } from './blob-handler.service';
import { ReturnedBlobDataDto } from './dto/returned-blob-data.dto';
import { SaveDataBlobDto } from './dto/save-data-blob.dto';

@Injectable()
export class BlobHandlerManager {
  constructor(private blobHandlerService: BlobHandlerService) {}

  saveDataToBlob(
    saveDataBlobDto: SaveDataBlobDto,
  ): Promise<ReturnedBlobDataDto> {
    return this.blobHandlerService.saveDataToBlob(saveDataBlobDto);
  }
}
