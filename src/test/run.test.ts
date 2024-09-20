
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

const execPromise = promisify(exec);
const usage = `
Usage: ./run [command]

Commands:
  install           Install project dependencies
  test              Run unit tests
  <url_file>.txt    Score modules from URLs listed in .txt file
`;

describe('Test run.ts main', () => {
  describe('Run with no arguments', () => {
    it('should throw error, print error, and print usage', async () => {
      // Run the command
      try {
        const { stdout: stdout, stderr:stderr } = await execPromise('./run');
        // Check for errors
        if (stderr) {
            throw new Error(`Error: ${stderr}`);
        }
        expect(null).not.toBeFalsy() // fail() shouldn't reach this line
      }
      catch (error: any) {
        expect(error.code).not.toBe(0);
        expect(error.stderr).toContain('No arguments provided to ./run');
        expect(error.stderr).toContain(usage);
        
      }      
    });
  });

  describe('Run with incorrect argument', () => {
    it('should throw error, print error, and print usage', async () => {
        // Run the command
      try {
        const { stdout: stdout, stderr:stderr } = await execPromise('./run incorrect_argument');
        expect(null).not.toBeFalsy() // fail() shouldn't reach this line
      } catch (error: any) {
        expect(error.stderr).toContain("Incorrect arguments provided to ./run");
        expect(error.stderr).toContain(usage);
      }
    });
  });
  describe('Run with correct argument ./run <file>.txt', () => {
    const tempFilePath = path.join(__dirname, 'test.txt');
    afterEach(async () => {
      // Clean up the temporary file after each test
      if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
      }
    });
    it('should throw no error and output code should be 0', async () => {
        // Run the command
        try {
          fs.writeFileSync(tempFilePath, 'https://www.npmjs.com/package/commander\nhttps://www.npmjs.com/package/command-line-args\nhttps://github.com/yargs/yargs');
          const { stdout: stdout, stderr:stderr } = await execPromise('./run ' + tempFilePath);
          expect(stdout).toMatch(/{"URL":"(https:\/\/www\.npmjs\.com\/package\/[a-zA-Z0-9\-]+|https:\/\/github\.com\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+)",\s*"NetScore":\d+(\.\d+)?,\s*"NetScore_Latency":\d+(\.\d+)?,\s*"RampUp":\d+(\.\d+)?,\s*"RampUp_Latency":\d+(\.\d+)?,\s*"Correctness":\d+(\.\d+)?,\s*"Correctness_Latency":\d+(\.\d+)?,\s*"BusFactor":-?\d+(\.\d+)?,\s*"BusFactor_Latency":-?\d+(\.\d+)?,\s*"ResponsiveMaintainer":\d+(\.\d+)?,\s*"ResponsiveMaintainer_Latency":\d+(\.\d+)?,\s*"License":\d+(\.\d+)?,\s*"License_Latency":\d+(\.\d+)?}/);
          
        }
        catch (error: any) {
          expect(null).not.toBeFalsy() // fail() shouldn't reach this line
        }      
      });
  });
  
});
