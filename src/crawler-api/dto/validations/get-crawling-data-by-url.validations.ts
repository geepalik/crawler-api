/* eslint-disable prettier/prettier */
import * as Joi from 'joi';

export class GetCrawlingDataByValidations {
  static getCrawlingDataByIdValidator(): Joi.ObjectSchema<unknown> {
    return Joi.object({
      url: Joi.string().uri({ scheme: 'https' }).required(),
    });
  }
}
