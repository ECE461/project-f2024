import {Logger} from '../logUtils';
import { URLFileHandler } from '../urlUtils/URLFileHandler';

export async function urlCommand (argument:string) {

    const urls = await URLFileHandler.getGithubUrlsFromFile(argument);
    if (urls === null) {
      Logger.logInfo('Error reading file or invalid URLs');
      process.exit(1)
    }
} 