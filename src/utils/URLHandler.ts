import axios from 'axios';
import { promises as fs } from 'fs';
import { Logger } from '../logUtils';

/**
 * Class for URLs
 * 
 * @method isValid
 * Returns if URL is valid
 * 
 * @method getRepoURL
 * Returns the github repository URL
 * For npm URLs, returns github repository URL if available, else returns null
 * If URL in invalid or not github/npm, returns null
 *
 */

export class URLHandler {
  url: string;
  githubURL: string | null = null;
  constructor(url: string) {
    this.url = url;
  }

  public getRepoURL(): string {
    if (this.githubURL === null) {
      return "";
    }
    return this.githubURL;
  }

  public getURL(): string {
    return this.url;
  }

  public async setRepoURL(): Promise<void> {
    if (URLHandler.isValidURL(this.url)) {
      const exists = await URLHandler.checkUrlExists(this.url);
      if (!exists) {
        return
      }

      if (this.url.startsWith('https://www.npmjs.com/package/')) {
        this.githubURL = await URLHandler.getGithubURLFromNpmURL(this.url);
      }
      else if (this.url.startsWith('https://github.com/')) {
        this.githubURL = this.url;
      }
    }
  }
  
  public getRepoName(): string{
    const match = this.url.match(/\/([^\/]+?)\.git$/);

    if (match && match.length > 1) {
      return match[1];
    }
    
    return "";
  }

  public static isValidURL(url: string): boolean {
    // Check if URL is valid
    try {
        new URL(url);
        return true;
    } catch (error) {
        Logger.logDebug('Invalid URL format:' + error);
        return false;
    }
  }

  public static async checkUrlExists(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      Logger.logInfo('Error checking URL:' + error);
      return false;
    }
  }

  public static async getGithubURLFromNpmURL(url: string): Promise<string | null> {
    // Get github repository URL from npm package URL
    try {
        const response = await axios.get(url);
        const html = response.data;
        const githubURL = html.match(/https:\/\/github.com\/[\w-]+\/[\w-]+/);
        if (githubURL) {
            return githubURL[0];
        }
    } catch (error) {
        Logger.logDebug('Error getting github URL from npm package:' + error);
    }
    return null;
  }
}