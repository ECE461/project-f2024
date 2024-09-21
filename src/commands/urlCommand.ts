import {Logger} from '../logUtils';
import { URLFileHandler } from '../utils/URLFileHandler';
import { BusFactor } from '../metrics/BusFactor';
import { Correctness } from '../metrics/Correctness';
import { RampUp } from '../metrics/RampUp';
import { LicenseMetric } from '../metrics/License';
import { ResponsiveMetric } from '../metrics/ResponsiveMetric';
import { NetScore } from '../metrics/NetScore';
import { URLHandler } from '../utils/URLHandler';
import { gitClone } from '../utils/isoGitHelper';
import { createNDJsonResult } from '../metrics/resultsHelper';
import path from 'path';
import * as fs from 'fs';

/**
 * [clearClonedRepos] - Deletes the cloned_repos folder recursively
 */
async function clearClonedRepos() {
  const folderPath = path.join(__dirname, '../../cloned_repos');
  if (fs.existsSync(folderPath)) {
    if (fs.lstatSync(folderPath).isDirectory()) {
      fs.rm(folderPath, { recursive: true, force: true }, (err) => {
        if (err) {
          console.error('Error while clearing folder');
          Logger.logDebug(err);
        } else {
          Logger.logInfo(`Folder ${folderPath} cleared successfully.`);
        }
      });
    }
  }
}

/**
  * [checkForGithubToken] - Checks if the Github token has been set as an environment variable
  * @throws {Error} if the Github token has not been set
  */
export function checkForGithubToken() {
  if (!process.env.GITHUB_TOKEN) {
    console.error('Please set the GITHUB_TOKEN environment variable');
    throw new Error('Please set the GITHUB_TOKEN environment variable');
  }
}

/**
 * Function to process a file containing URLs to Github repositories and output the metrics
 * @param argument - the file containing the URLs
 * @throws {Error} if the file is invalid or the URLs are invalid
 */
export async function urlCommand (argument:string) {
    checkForGithubToken();

    const urls = await URLFileHandler.getGithubUrlsFromFile(argument);
    if (urls === null) {
      Logger.logInfo('Error reading file or file has invalid URLs');
      console.error('Error reading file or file has invalid URLs');
      throw new Error('Error reading file or file has invalid URLs');
    }
    
    // TODO: Maybe make this parallel?
    try {
      for (const url of urls) {
        // Clone repository
        await gitClone(url);
  
        // Setup metrics
        Logger.logInfo(`Processing URL: ${url.getRepoURL()}`);
        const netScore = new NetScore()
        const busFactor = new BusFactor(url);  // git clone
        const corScore = new Correctness(url);
        const rampUp = new RampUp(url); // git api call
        const licScore = new LicenseMetric(url); // git api call
        const respMet = new ResponsiveMetric(url); // git api call
  
        // Calculate metrics
        netScore.startTimer();
        await Promise.allSettled([busFactor.calculateScore(), corScore.calculateScore(), rampUp.calculateScore(), licScore.calculateScore(), respMet.calculateScore()]);
        netScore.endTimer();
  
        netScore.calculateScore(busFactor, corScore, licScore, rampUp,  respMet);
  
        const ndjsonResult = createNDJsonResult(netScore, [rampUp, corScore, busFactor, respMet, licScore]);
        
        // Final Output
        console.log(ndjsonResult);
      }
      await clearClonedRepos();

    } catch (error) {
      Logger.logInfo('Error calculating Metrics');
      Logger.logDebug(error);
      await clearClonedRepos();
    }
    
} 