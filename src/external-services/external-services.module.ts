import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpApiService } from './http-api.service';
import { LocalFileHandlerService } from './local-file-handler.service';

@Module({
  imports: [HttpModule],
  providers: [LocalFileHandlerService, HttpApiService],
  exports: [LocalFileHandlerService, HttpApiService],
})
export class ExternalServicesModule {}
