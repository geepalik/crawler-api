import { Module } from '@nestjs/common';
import { BlobHandlerManager } from './blob-handler.manager';
import { BlobHandlerService } from './blob-handler.service';

@Module({
  providers: [BlobHandlerService, BlobHandlerManager],
  exports: [BlobHandlerManager],
})
export class BlobHandlerModule {}
