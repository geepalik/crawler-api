/* eslint-disable prettier/prettier */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import * as mongoose from 'mongoose';
import Consts from '../consts/consts';

@Catch(mongoose.mongo.MongoServerError)
export class MongoDbExceptionFilter implements ExceptionFilter {
  /**
   * central exception filter for MongoDB related errors
   * this is case when a record is not found in database
   * and we send a customised response
   * can be extended to handle other errors from db, e.g. duplicate on insert
   * @param exception
   * @param host
   */
  catch(exception: MongoServerError, host: ArgumentsHost) {
    switch (exception.code) {
      case Consts.DATA_DB_NOT_FOUND:
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        response.status(HttpStatus.NOT_FOUND).json({
          message: exception.message,
        });
        break;
    }
  }
}
