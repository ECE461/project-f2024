import { promises as fs } from 'fs';
import { URLHandler } from './URLHandler';
import { Logger } from '../logUtils';

export class URLFileHandler {
    public static isTxtFile(filePath: string): boolean {
        return filePath.endsWith('.txt');
    }

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