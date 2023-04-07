/* eslint-disable prettier/prettier */
import * as Joi from 'joi';

export class CrawlValidations {
  static crawlValidator(): Joi.ObjectSchema<unknown> {
    return Joi.object({
      url: Joi.string().uri().required(),
    });
  }
}
