import { Module } from '@nestjs/common';
import { LocalFileHandlerService } from './local-file-handler.service';

@Module({
  providers: [LocalFileHandlerService],
  exports: [LocalFileHandlerService],
})
export class ExternalServicesModule {}
