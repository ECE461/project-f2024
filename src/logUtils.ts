import * as fs from 'fs';

enum LogLevel {
    SILENT = 0, // Default log level
    INFO = 1,
    DEBUG = 2,
}

// Set settings from environment variables
const envLogLevel = parseInt(process.env.LOG_LEVEL || '0', 10);
const logLevel = Object.values(LogLevel).includes(envLogLevel) ? envLogLevel : LogLevel.SILENT;
const logFilePath = process.env.LOG_FILE || './default.log';

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
    public static logInfo(message: string) {
        console.log(logLevel);
        if (logLevel >= LogLevel.INFO) {
            try {
                fs.appendFileSync(logFilePath, message + "\n", 'utf8');
            } catch (error) {
                console.error('Error writing to log file:', error);
            }   
        }
    }
    
    public static logDebug(message: string) {
        if (logLevel >= LogLevel.DEBUG) {
            try {
                fs.appendFileSync(logFilePath, message + "\n", 'utf8');
            } catch (error) {
                console.error('Error writing to log file:', error);
            } 
        }
    }
}