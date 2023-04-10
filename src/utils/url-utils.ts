/* eslint-disable prettier/prettier */
export class UrlUtils {
  /**
   * checks if a string passed to it is a valid URL
   * @param urlString
   * @returns {boolean}
   */
  static isValidUrl(urlString: string): boolean {
    let url;
    try {
      url = new URL(urlString);
    } catch (error) {
      return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
  }

  /**
   * check if a string passed is valid URL and equal to host
   * @param urlString
   * @param currentHost
   * @returns
   */
  static isSameHost(urlString: string, currentHost: string): boolean {
    let url;
    try {
      url = new URL(urlString);
    } catch (error) {
      return false;
    }
    return url.host === currentHost;
  }

  static getURLHost(urlString: string): string {
    const url = new URL(urlString);
    return url.host;
  }
}
