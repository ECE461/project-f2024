import { exec } from 'child_process';
import { Logger } from '../logUtils';
import { createCoverageMap } from 'istanbul-lib-coverage';

export async function runTests() {
  try {
    exec('npx jest --json --coverage', (err, stdout, stderr) => {
        if (err) {
          Logger.logInfo('Error running tests:' + stderr);
          throw new Error('Error running jest tests');
        }

        // Parse Jest results
        const results = JSON.parse(stdout);
        const total = results.numTotalTests;
        const passed = results.numPassedTests;
        const coverageMapp = createCoverageMap(results.coverageMap);
        let totalLines = 0;
        let coveredLines = 0;
        coverageMapp.files().forEach((filePath) => {
          const fileCoverage = coverageMapp.fileCoverageFor(filePath);
          const { lines } = fileCoverage.toSummary();
          
          totalLines += lines.total;
          coveredLines += lines.covered;
        });
        const averageCoverage = totalLines > 0 ? (coveredLines / totalLines) * 100 : 0;

        // Print formatted output
        console.log(`Total: ${total}`);
        console.log(`Passed: ${passed}`);
        console.log(`Coverage: ${averageCoverage.toFixed(2)}%`);
        console.log(`${passed}/${total} test cases passed. ${averageCoverage.toFixed(2)}% line coverage achieved.`);
    });
  } catch (error) {
    Logger.logInfo(`${error}`);
  }
}
