/* eslint-disable prettier/prettier */
export interface SaveCrawlDataDto {
  url: string;
  screenshot: string;
  stylesheets: string[];
  scripts: string[];
  links: string[];
  outgoingLinks: string[];
}
