import { exec } from 'child_process';
import { Logger } from '../logUtils';

export function runTests() {
    exec('npx jest --json --coverage', (err, stdout, stderr) => {
        if (err) {
          Logger.logInfo('Error running tests:' + stderr);
          return;
        }
    
        // Parse Jest results
        const results = JSON.parse(stdout);
        const total = results.numTotalTests;
        const passed = results.numPassedTests;

        let totalCoverage = 0;
        let fileCount = 0;
        for (const file of Object.values(results.coverageMap)) {
            if (isCoverageFile(file)) {
                const statements = file.s || {};
                const totalStatements = Object.keys(statements).length;
                const coveredStatements = Object.values(statements).filter(s => s > 0).length;
        
                if (totalStatements > 0) {
                totalCoverage += (coveredStatements / totalStatements) * 100;
                fileCount++;
                }
            }
        }
      
        const averageCoverage = fileCount > 0 ? totalCoverage / fileCount : 0;
    
        // Print formatted output
        console.log(`Total: ${total}`);
        console.log(`Passed: ${passed}`);
        console.log(`Coverage: ${averageCoverage.toFixed(2)}%`);
        console.log(`${passed}/${total} test cases passed. ${averageCoverage.toFixed(2)}% line coverage achieved.`);
      });
}

function isCoverageFile(file: unknown): file is CoverageFile {
    return (
      typeof file === 'object' &&
      file !== null &&
      's' in file &&
      'f' in file &&
      'b' in file
    );
}

interface CoverageFile {
    path: string;
    statementMap: Record<string, any>;
    fnMap: Record<string, any>;
    branchMap: Record<string, any>;
    s: Record<string, number>;  // statements coverage
    f: Record<string, number>;  // functions coverage
    b: Record<string, number>;  // branches coverage
}