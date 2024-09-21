import {Logger} from '../logUtils';
import { URLFileHandler } from '../utils/URLFileHandler';
import { BusFactor } from '../metrics/BusFactor';
import { Correctness } from '../metrics/Correctness';
import { RampUp } from '../metrics/RampUp';
import { License } from '../metrics/License';
import { ResponsiveMetric } from '../metrics/ResponsiveMetric';
import { NetScore } from '../metrics/NetScore';
import { URLHandler } from '../utils/URLHandler';
import { gitClone } from '../utils/isoGitHelper';
import { createNDJsonResult } from '../metrics/resultsHelper';

export async function urlCommand (argument:string) {

    const urls = await URLFileHandler.getGithubUrlsFromFile(argument);
    // If null, failed check for file or invalid URLs
    if (urls === null) {
      Logger.logInfo('Error reading file or invalid URLs');
      console.error('Error reading file or invalid URLs');
      throw new Error('Error reading file or invalid URLs');
    }
    
    // TODO: Maybe make this parallel?
    for (const url of urls) {
      // Clone repository
      gitClone(url);

      // Calculate metrics
      Logger.logInfo(`Processing URL: ${url.getRepoURL()}`);
      const netScore = new NetScore()
      const busFactor = new BusFactor(url);  // git clone
      const corScore = new Correctness(url);
      const rampUp = new RampUp(url); // git api call
      const licScore = new License(url); // git api call
      const respMet = new ResponsiveMetric(url); // git api call

      netScore.startTimer();
      await Promise.allSettled([busFactor.calculateScore(), corScore.calculateScore(), rampUp.calculateScore(), licScore.calculateScore(), respMet.calculateScore()]);
      netScore.endTimer();

      await netScore.calculateScore(busFactor, corScore, licScore, rampUp,  respMet);

      const ndjsonResult = createNDJsonResult(netScore, [rampUp, corScore, busFactor, respMet, licScore]);
      
      // Final Output
      console.log(ndjsonResult);
    }
} 