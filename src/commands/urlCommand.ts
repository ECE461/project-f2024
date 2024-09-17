import {Logger} from '../logUtils';
import { URLFileHandler } from '../utils/URLFileHandler';
import { BusFactor } from '../metrics/BusFactor';
import { Correctness } from '../metrics/Correctness';
import { RampUp } from '../metrics/RampUp';
import { License } from '../metrics/License';
import { ResponsiveMetric } from '../metrics/ResponsiveMetric';
import { NetScore } from '../metrics/NetScore';
import { URLHandler } from '../utils/URLHandler';
import { gitClone } from '../utils/gitClone';
import { createNDJsonResult } from '../metrics/resultsHelper';

export async function urlCommand (argument:string) {

    const urls = await URLFileHandler.getGithubUrlsFromFile(argument);
    // If null, failed check for file or invalid URLs
    if (urls === null) {
      Logger.logInfo('Error reading file or invalid URLs');
      process.exit(1)
    }
    
    // TODO: Maybe make this parallel?
    for (const url of urls) {
      // Clone repository
      gitClone(url.getRepoURL(), "");

      // Calculate metrics
      Logger.logInfo(`Processing URL: ${url.getRepoURL()}`);
      const netScore = new NetScore()
      const busFactor = new BusFactor(url);  // git clone
      const corScore = new Correctness(url);
      const rampUp = new RampUp(url); // git clone
      const licScore = new License(url); // git api call
      const respMet = new ResponsiveMetric(url); // git api call

      netScore.startTimer();
      const results = await Promise.all([busFactor.calculateScore(), corScore.calculateScore(), rampUp.calculateScore(), licScore.calculateScore(), respMet.calculateScore()]);
      netScore.endTimer();

      netScore.calculateScore(rampUp, busFactor, corScore, licScore,  respMet);

      const ndjsonResult = createNDJsonResult(netScore, [rampUp, corScore, busFactor, respMet, licScore]);
      
      // Final Output
      console.log(ndjsonResult);
    }
    process.exit(0);
} 