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

  public static async getRepoURL(url: string): Promise<string | null> {
    if (!URLHandler.isValidURL(url)) {
        return null;
    }

    if (url.startsWith('https://www.npmjs.com/package/')) {
        return await URLHandler.getGithubURLFromNpmURL(url);
    }
    else if (url.startsWith('https://github.com/')) {
        return url;
    }

    return null;
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