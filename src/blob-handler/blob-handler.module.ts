import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExternalServicesModule } from 'src/external-services/external-services.module';
import { BlobHandlerManager } from './blob-handler.manager';
import { BlobHandlerService } from './blob-handler.service';

@Module({
  imports: [ExternalServicesModule, ConfigModule],
  providers: [BlobHandlerService, BlobHandlerManager],
  exports: [BlobHandlerManager],
})
export class BlobHandlerModule {}
