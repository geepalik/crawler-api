import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { ScrapingUtils } from 'src/utils/scraping-utils';
import { CrawlDataDto } from './dto/crawl-data.dto';
import { LinksDto } from './dto/links.dto';
import { StylesScriptsDto } from './dto/styles-scripts.dto';
@Injectable()
export class ScraperService {
  currentUrlInfo: URL;

  async getCrawlingData(url: string): Promise<CrawlDataDto> {
    let browser;
    try {
      //instantiate browser
      browser = await puppeteer.launch();
      //create page and go to url
      const page = await browser.newPage();
      await page.goto(url);

      this.currentUrlInfo = new URL(url);

      const screenshot = await this.getScreenshot(page);
      const urls = await this.getUrls(page);
      const styles = await this.getStyles(page);
      const scripts = await this.getScripts(page);

      return { screenshot, urls, styles, scripts };
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    } finally {
      await browser?.close();
    }
  }

  private getScreenshot(page: puppeteer.Page): Promise<Buffer> {
    return page.screenshot();
  }

  private async getUrls(page: puppeteer.Page): Promise<LinksDto> {
    const domainLinks = await page.$$eval('a', (as) => as.map((a) => a.href));
    return this.categorizeUrls(domainLinks);
  }

  private categorizeUrls(domainLinks: Array<string>): LinksDto {
    const links = [],
      outgoingLinks = [];
    domainLinks
      .filter((link) => ScrapingUtils.isValidUrl(link))
      .forEach((link) => {
        if (ScrapingUtils.isSameHost(link, this.currentUrlInfo.host)) {
          links.push(link);
        } else {
          outgoingLinks.push(link);
        }
      });
    return { links, outgoingLinks };
  }

  private async getStyles(page: puppeteer.Page): Promise<StylesScriptsDto> {
    const linkStyles = await page.$$eval('link[rel="stylesheet"]', (links) =>
      links.map((link) => link.href),
    );
    const inlineStyles = await page.$$eval('style', (styles) =>
      styles.map((style) => style.textContent),
    );
    return { links: linkStyles, inline: inlineStyles };
  }

  private async getScripts(page: puppeteer.Page): Promise<StylesScriptsDto> {
    const results = await page.$$eval('script', (scripts) => {
      const links = [],
        inline = [];
      scripts.forEach((script) => {
        if (script.src) {
          links.push(script.src);
        } else {
          inline.push(script.textContent);
        }
      });
      return { links, inline };
    });
    return results;
  }
}
