import { promises as fs } from 'fs';
import { URLHandler } from './URLHandler';
import { Logger } from '../logUtils';

export class URLFileHandler {
    /**
     * @static 
     * @function isTxtFile(): is the file containing all the urls all txt files?
     * @param {string} filePath: absolute path to the file
     * @returns {boolean}
     */
    public static isTxtFile(filePath: string): boolean {
        return filePath.endsWith('.txt');
    }

    /**
     * @static @async
     * @function getGithubUrlsFromFile(): reads url from txt file. gets rid of white space and extra '\n's 
     * @param {string} filepath: absolute path to the file
     * @returns {Promise<URLHandler[] | null>}: returns array of all existing urls or null, if file is empty
     */
    public static async getGithubUrlsFromFile(filePath: string): Promise<URLHandler[] | null> {
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            const urls = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);

            const urlItems: URLHandler[] = [];
            for (const url of urls) {
                if (URLHandler.isValidURL(url)) {
                    const URL = new URLHandler(url);
                    await URL.setRepoURL();

                    const githubUrl = await URL.getRepoURL();
                    if (githubUrl !== "") {
                        urlItems.push(URL);
                    }
                    else {
                        // If URL is invalid bc not github/npm, or github URL not found from npm URL -> return null
                        Logger.logDebug('Not a github/npm URL: ' + url);
                        return null;
                    }
                }
                else {
                    Logger.logDebug('Invalid URL: ' + url);
                    return null;
                }
            }
            return urlItems;
        } catch (error) {
            Logger.logDebug('Error reading file:' + error);
            return null;
        }
        
    }
}