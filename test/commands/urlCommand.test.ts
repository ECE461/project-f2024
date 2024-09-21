import { template } from '@babel/core';
import { urlCommand } from '../../src/commands/urlCommand';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { Logger } from '../../src/logUtils';

describe('urlCommand', () => {
    const tempFilePath = path.join(__dirname, 'test.txt');
    let consoleSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;
    describe('URL Command Correct', () => {
        afterEach(async () => {
            // Clean up the temporary file after each test
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
            if (consoleSpy) {
                consoleSpy.mockRestore()
            }  
        });
        it('should return a list of metrics for a given URL', async () => {
            consoleSpy = jest.spyOn(console, 'log');
            // Make temp file test.txt with correct URLs on each line: https://www.npmjs.com/package/commander, https://www.npmjs.com/package/command-line-args, https://github.com/yargs/yargs 
            fs.writeFileSync(tempFilePath, 'https://www.npmjs.com/package/commander\nhttps://www.npmjs.com/package/command-line-args\nhttps://github.com/yargs/yargs');
            await urlCommand(tempFilePath);

            // Check if stdout contains the expected results
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(
                /{"URL":"(https:\/\/www\.npmjs\.com\/package\/[a-zA-Z0-9\-]+|https:\/\/github\.com\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+)",\s*"NetScore":\d+(\.\d+)?,\s*"NetScore_Latency":\d+(\.\d+)?,\s*"RampUp":\d+(\.\d+)?,\s*"RampUp_Latency":\d+(\.\d+)?,\s*"Correctness":\d+(\.\d+)?,\s*"Correctness_Latency":\d+(\.\d+)?,\s*"BusFactor":-?\d+(\.\d+)?,\s*"BusFactor_Latency":-?\d+(\.\d+)?,\s*"ResponsiveMaintainer":\d+(\.\d+)?,\s*"ResponsiveMaintainer_Latency":\d+(\.\d+)?,\s*"License":\d+(\.\d+)?,\s*"License_Latency":\d+(\.\d+)?}/
            ));
        }, 10000);
    });
    describe('URL Command No File', () => {
        afterEach(() => {
            if (consoleErrorSpy) {
                consoleErrorSpy.mockRestore()
            }   
        });
        it('should print Error reading file or file has invalid URLs', async () => {  
            consoleErrorSpy = jest.spyOn(console, 'error');  

            await expect(urlCommand('test1.txt')).rejects.toThrow('Error reading file or file has invalid URLs');

            // Check if stdout contains the expected results
            expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringMatching("Error reading file or file has invalid URLs"));
        });
    });
    describe('urlCommand - Fail to delete cloned repos', () => {
        const execPromise = promisify(exec);
        const clonedReposPath = path.join(__dirname, '../../cloned_repos');
        beforeEach(async() => {
            try {
                await execPromise(`chmod -w ${clonedReposPath}`);
                Logger.logInfo(`Successfully changed permissions for ${clonedReposPath}`);
            } catch (error) {
                Logger.logInfo('Error changing permissions:'+ error);
            }
        });
        afterEach(async () => {
            try {
                await execPromise(`chmod +w ${clonedReposPath}`);
                Logger.logInfo(`Successfully changed permissions for ${clonedReposPath}`);
            } catch (error) {
                Logger.logInfo('Error changing permissions:' + error);
            }
            if (consoleErrorSpy) {
                consoleErrorSpy.mockRestore()
            } 
        });
          
        it('should print "Error while clearing folder"', async () => {  
            consoleErrorSpy = jest.spyOn(console, 'error');  

            await expect(urlCommand('test1.txt')).rejects.toThrow('Error reading file or file has invalid URLs');

            // Check if stdout contains the expected results
            expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringMatching('Error reading file or file has invalid URLs'));
        });
    });
});
