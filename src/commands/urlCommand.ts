import {Logger} from '../logUtils';
import { URLFileHandler } from '../urlUtils/URLFileHandler';
import { BusFactor } from '../metrics/BusFactor';
import { Correctness } from '../metrics/Correctness';
import { RampUp } from '../metrics/RampUp';
import { License } from '../metrics/License';
import { ResponsiveMetric } from '../metrics/ResponsiveMetric';
import { NetScore } from '../metrics/NetScore';
import { URLHandler } from '../urlUtils/URLHandler';

export async function urlCommand (argument:string) {

    const urls = await URLFileHandler.getGithubUrlsFromFile(argument);
    if (urls === null) {
      Logger.logInfo('Error reading file or invalid URLs');
      process.exit(1)
    }
    
    for (const url of urls) {
      // TODO: function to clone repository***
      Logger.logInfo(`Processing URL: ${url}`);
      const busFactor = new BusFactor(url);  // git clone
      const corScore = new Correctness(url);
      const rampUp = new RampUp(url); // git clone
      const licScore = new License(url); // git api call
      const respMet = new ResponsiveMetric(url); // git api call

      const results = await Promise.all([busFactor.calculateScore(), corScore.calculateScore(), rampUp.calculateScore(), licScore.calculateScore(), respMet.calculateScore()]);
      const netScore = new NetScore().calculateScore(busFactor, corScore, licScore, rampUp, respMet);

      // TODO: Function to parse netScore and individual scores to NDJSON
    }
} 