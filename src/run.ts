import minimist from 'minimist';
import { URLFileHandler } from './utils/URLFileHandler';
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
    // Score modules from URLs listed in file (arument)
    await urlCommand(argument);
  }
  else {
    console.log(usage);
    process.exit(1);
  }

  process.exit(0);
}

main().catch(error => {
  Logger.logDebug('Error:'+ error);
  process.exit(1);
});