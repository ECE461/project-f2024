import * as fs from 'fs';

enum LogLevel {
    SILENT = 0, // Default log level
    INFO = 1,
    DEBUG = 2,
}

/**
 * @method logInfo
 * Logs message to file if log level is INFO(1) or higher
 * 
 * @method logDebug
 * Logs message to file if log level is DEBUG(2) or higher
 * 
 * How to use:
 * 1. Setup environment variables LOG_LEVEL and LOG_FILE
 * 2. Import Logger class in your file
 *      import { Logger } from './<path_to_dir>/logUtils';
 *      Logger.logInfo("Info Message"); // Logs to file if log level is INFO(1) or higher
 *      Logger.logDebug("Debug Message"); // Logs to file if log level is DEBUG(2) or higher
 */
export class Logger {
    public static envLogLevel: LogLevel = LogLevel.SILENT;
    public static logLevel: LogLevel = LogLevel.SILENT;
    public static logFilePath: string = './default.log';

    constructor() {
        // Set settings from environment variables
        Logger.envLogLevel = parseInt(process.env.LOG_LEVEL || '0', 10);
        Logger.logLevel = Object.values(LogLevel).includes(Logger.envLogLevel) ? Logger.envLogLevel : LogLevel.SILENT;
        Logger.logFilePath = process.env.LOG_FILE || './default.log';  
        if (!fs.existsSync(Logger.logFilePath)) {
            fs.writeFileSync(Logger.logFilePath, '',  { flag: 'w' });
        }
    }

    public static logInfo(message: string) {
        if (Logger.logLevel >= LogLevel.INFO) {
            try {
                fs.appendFileSync(Logger.logFilePath, message + "\n", 'utf8');
            } catch (error) {
                console.error('Error writing to log file:', error);
            }
        }
    }

    public static logDebug(message: string) {
        if (Logger.logLevel >= LogLevel.DEBUG) {
            try {
                fs.appendFileSync(Logger.logFilePath, message + "\n", 'utf8');
            } catch (error) {
                console.error('Error writing to log file:', error);
            }
        }
    }
}