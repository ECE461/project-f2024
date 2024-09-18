import { Logger } from '../logUtils';
import * as fs from 'fs';

jest.mock('fs');

describe('Logger', () => {
    let originalLogLevel: string | undefined;
    let originalLogFile: string | undefined;

    beforeEach(() => {
        originalLogLevel = process.env.LOG_LEVEL;
        originalLogFile = process.env.LOG_FILE;
        jest.clearAllMocks();
    });

    afterEach(() => {
        process.env.LOG_LEVEL = originalLogLevel;
        process.env.LOG_FILE = originalLogFile;
    });

    it('should set log level and log file path from environment variables', () => {
        process.env.LOG_LEVEL = '1';
        process.env.LOG_FILE = '/tmp/test.log';

        new Logger();

        expect(Logger.logLevel).toBe(1);
        expect(Logger.logFilePath).toBe('/tmp/test.log');
    });

    it('should default to SILENT log level if environment variable is invalid', () => {
        process.env.LOG_LEVEL = 'invalid';

        new Logger();

        expect(Logger.logLevel).toBe(0);
    });

    it('should create log file if it does not exist', () => {
        process.env.LOG_FILE = '/tmp/test.log';
        (fs.existsSync as jest.Mock).mockReturnValue(false);

        new Logger();

        expect(fs.writeFileSync).toHaveBeenCalledWith('/tmp/test.log', '', { flag: 'w' });
    });

    it('should log info messages if log level is INFO or higher', () => {
        process.env.LOG_LEVEL = '1';
        process.env.LOG_FILE = '/tmp/test.log';
        (fs.existsSync as jest.Mock).mockReturnValue(true);

        new Logger();
        Logger.logInfo('Info message');

        expect(fs.appendFileSync).toHaveBeenCalledWith('/tmp/test.log', 'Info message\n', 'utf8');
    });

    it('should not log info messages if log level is lower than INFO', () => {
        process.env.LOG_LEVEL = '0';
        process.env.LOG_FILE = '/tmp/test.log';
        (fs.existsSync as jest.Mock).mockReturnValue(true);

        new Logger();
        Logger.logInfo('Info message');

        expect(fs.appendFileSync).not.toHaveBeenCalled();
    });

    it('should log debug messages if log level is DEBUG', () => {
        process.env.LOG_LEVEL = '2';
        process.env.LOG_FILE = '/tmp/test.log';
        (fs.existsSync as jest.Mock).mockReturnValue(true);

        new Logger();
        Logger.logDebug('Debug message');

        expect(fs.appendFileSync).toHaveBeenCalledWith('/tmp/test.log', 'Debug message\n', 'utf8');
    });

    it('should not log debug messages if log level is lower than DEBUG', () => {
        process.env.LOG_LEVEL = '1';
        process.env.LOG_FILE = '/tmp/test.log';
        (fs.existsSync as jest.Mock).mockReturnValue(true);

        new Logger();
        Logger.logDebug('Debug message');

        expect(fs.appendFileSync).not.toHaveBeenCalled();
    });

    it('should handle errors when writing to log file', () => {
        process.env.LOG_LEVEL = '1';
        process.env.LOG_FILE = '/tmp/test.log';
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.appendFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('Write error');
        });

        new Logger();
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        Logger.logInfo('Info message');

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error writing to log file:', new Error('Write error'));

        consoleErrorSpy.mockRestore();
    });
});