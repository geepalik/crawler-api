/* eslint-disable prettier/prettier */
import mongoose from 'mongoose';
import Consts from 'src/utils/consts/consts';

export const crawlingData = new mongoose.Schema(
  {
    url: { type: String, required: true, unique: true },
    screenshot: { type: String, required: true },
    stylesheets: { type: mongoose.Schema.Types.Array, required: true },
    scripts: { type: mongoose.Schema.Types.Array, required: true },
    links: { type: mongoose.Schema.Types.Array, required: true },
    outgoingLinks: { type: mongoose.Schema.Types.Array, required: true },
  },
  { timestamps: true, collection: Consts.CRAWLING_DATA_NAMES.docName },
);

export type CrawlingDataModel = mongoose.Document;
