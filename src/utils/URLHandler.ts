import axios from 'axios';
import { Logger } from '../logUtils';

/**
 * @class URLHandler
 * @description 
 * The URLHandler class is responsible for handling URL-related operations,
 * such as validating URLs, checking if a URL exists, extracting GitHub repository
 * URLs from npm package URLs, and constructing base API URLs for GitHub repositories.
 *
 * This class provides methods to interact with URLs and perform various operations
 * like setting repository URLs, getting base API URLs, and extracting repository names.
 *
 * @example
 * // Creating an instance of URLHandler
 * const urlHandler = new URLHandler('https://github.com/user/repo');
 * 
 * // Setting the repository URL
 * await urlHandler.setRepoURL();
 * 
 * // Getting the repository URL
 * const repoURL = urlHandler.getRepoURL();
 * 
 * // Getting the base API URL
 * const baseAPI = urlHandler.getBaseAPI();
 *
 * @param {string} url - The URL to be handled.
 *
 * @method getRepoURL(): string
 * Returns the GitHub repository URL if set, otherwise an empty string.
 *
 * @method getBaseAPI(): string
 * Returns the base API URL for the GitHub repository if set, otherwise an empty string.
 * 
 * @method getURL(): string
 * Returns the original URL.
 * 
 * @method setRepoURL(): Promise<void>
 * Sets the GitHub repository URL and base API URL if the original URL is valid and exists.
 * 
 * @method getRepoName(): string
 * Extracts and returns the repository name from the URL.
 * 
 * @method static isValidURL(url: string): boolean
 * Checks if the provided URL is valid.
 * 
 * @method static checkUrlExists(url: string): Promise<boolean>
 * Checks if the provided URL exists by making a HEAD request.
 * 
 * @method static getGithubURLFromNpmURL(url: string): Promise<string | null>
 * Extracts and returns the GitHub repository URL from an npm package URL.
 */
export class URLHandler {
  url: string; // the provided URL
  githubURL: string | null = null; // the GitHub repository URL
  baseAPI: string | null = null;  // the base API URL
  
  constructor(url: string) {
    this.url = url;
  }

  /**
   * @method getRepoURL 
   * @return {string} The GitHub repository URL if set, otherwise an empty string.
   * @description
   * This method returns the GitHub repository URL if set, otherwise an empty string.
   */
  public getRepoURL(): string {
    if (this.githubURL === null) {
      return "";
    }
    return this.githubURL;
  }

    /**
     * @method getBaseAPI
     * @return {string} The base API URL for the GitHub repository if set, otherwise an empty string.
     * @description
     * This method returns the base API URL for the GitHub repository if set, otherwise an empty string.
     * Link is `https://api.github.com/repos/${repoAuthority}/${repoName}`, where user can concat relevant api endpoints.
     * 
     */
  public getBaseAPI(): string {
    if (this.baseAPI === null) {
      return "";
    }
    return this.baseAPI;
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

      if(this.githubURL !== null) {
        const urlParts = this.githubURL.split('github.com/')[1].split('/');  // divide the github URL into parts
        const repoAuthority = urlParts[0];  // can be either the owner or the organization of the repo
        const repoName = urlParts[1];  // name of the repository
        this.baseAPI = `https://api.github.com/repos/${repoAuthority}/${repoName}`;  // base API URL
      }
    }
  }
  
  public getRepoName(): string{
    const match = this.url.match(/\/([^\/]+?)(?:\.git)?$/);
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