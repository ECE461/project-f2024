import minimist from 'minimist';
import { URLFileHandler } from './urlUtils/URLFileHandler';
import { Logger } from './logUtils';
import { log } from 'console';
import { runTests } from './commands/test';
import {urlCommand} from './commands/urlCommand';
import { url } from 'inspector';

const usage = `
Usage: node run.js [command] [options]

Commands:
  install           Install project dependencies
  test              Run unit tests
  <url_file>.txt    Score modules from URLs listed in .txt file
`;

/**
 * [main] - Home base of the program. Calls other functions based on command line
 * arguments e.g "./run test" or "./run <url_file>".
 * 
 * Note: "./run install" is handled in the bash script 
 */
async function main() {
  // Parse command line arguments
  const args = minimist(process.argv.slice(2));

  // If no arguments are provided, show usage
  if (args._.length === 0) {
    console.log(usage);
    process.exit(1);
  }

  const argument = args._[0];

  if (argument === 'test') {
    Logger.logDebug('Running tests...');
    console.log("Running tests...");
    runTests();
  }
  else if (URLFileHandler.isTxtFile(argument)) {
    await urlCommand(argument);
    // TODO: Call to concurrency function and scoring logic

    
    // Sample output
    // console.log(`{"URL":"https://www.npmjs.com/package/express", "NetScore":0, "NetScore_Latency": 0.133,"RampUp":0.5, "RampUp_Latency": 0.002, "Correctness":0.7, "Correctness_Latency":0.076, "BusFactor":-1, "BusFactor_Latency":-1, "ResponsiveMaintainer":0.6, "ResponsiveMaintainer_Latency": 0.009, "License":0, "License_Latency": 0.046}`)
  }
  else {
    console.log(usage);
    process.exit(1);
  }
}

main().catch(error => {
  Logger.logDebug('Error:'+ error);
  process.exit(1);
});