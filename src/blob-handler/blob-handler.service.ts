import { Injectable } from '@nestjs/common';
import { ReturnedBlobDataDto } from './dto/returned-blob-data.dto';
import { SaveDataBlobDto } from './dto/save-data-blob.dto';

@Injectable()
export class BlobHandlerService {
  saveDataToBlob(saveDataBlobDto: SaveDataBlobDto): ReturnedBlobDataDto {
    const { screenshot, styles, scripts } = saveDataBlobDto;
    return {
      screenshot: 'path',
      stylesheets: ['path1', 'path2', 'path3'],
      scripts: ['path1', 'path2', 'path3'],
      links: [
        'https://www.sellersnap.io/#primary',
        'https://www.sellersnap.io/',
        'https://www.sellersnap.io/features/',
      ],
      outgoingLinks: [
        'https://app.sellersnap.io/login',
        'https://login.sellersnap.io/forms/signin',
        'https://app.sellersnap.io/login',
      ],
    };
  }
}
