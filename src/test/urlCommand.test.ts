import { template } from '@babel/core';
import { urlCommand } from '../commands/urlCommand';
import * as fs from 'fs';
import * as path from 'path';

describe('URL Command', () => {
    const tempFilePath = path.join(__dirname, 'test.txt');
    let consoleSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;
    afterEach(() => {
        // Clean up the temporary file after each test
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
        if (consoleSpy) {
            consoleSpy.mockRestore()
        }
        if (consoleErrorSpy) {
            consoleErrorSpy.mockRestore()
        }   
    });
    describe('URL Command Correct', () => {
        it('should return a list of metrics for a given URL', async () => {
            consoleSpy = jest.spyOn(console, 'log');
            // Make temp file test.txt with correct URLs on each line: https://www.npmjs.com/package/commander, https://www.npmjs.com/package/command-line-args, https://github.com/yargs/yargs 
            fs.writeFileSync(tempFilePath, 'https://www.npmjs.com/package/commander\nhttps://www.npmjs.com/package/command-line-args\nhttps://github.com/yargs/yargs');
            await urlCommand(tempFilePath);

            // Check if stdout contains the expected results
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(
                /{"URL":"(https:\/\/www\.npmjs\.com\/package\/[a-zA-Z0-9\-]+|https:\/\/github\.com\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+)",\s*"NetScore":\d+(\.\d+)?,\s*"NetScore_Latency":\d+(\.\d+)?,\s*"RampUp":\d+(\.\d+)?,\s*"RampUp_Latency":\d+(\.\d+)?,\s*"Correctness":\d+(\.\d+)?,\s*"Correctness_Latency":\d+(\.\d+)?,\s*"BusFactor":-?\d+(\.\d+)?,\s*"BusFactor_Latency":-?\d+(\.\d+)?,\s*"ResponsiveMaintainer":\d+(\.\d+)?,\s*"ResponsiveMaintainer_Latency":\d+(\.\d+)?,\s*"License":\d+(\.\d+)?,\s*"License_Latency":\d+(\.\d+)?}/
            ));
        });
    });
    describe('URL Command No File', () => {
        it('should print Error reading file or invalid URLs', async () => {  
            consoleErrorSpy = jest.spyOn(console, 'error');  

            await expect(urlCommand('test1.txt')).rejects.toThrow('Error reading file or invalid URLs');

            // Check if stdout contains the expected results
            expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringMatching("Error reading file or invalid URLs"));
        });
    });
});
