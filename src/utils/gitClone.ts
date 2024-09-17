//modules
import {execSync} from 'child_process'; //used to write shell commands 
import * as path from 'path'; 
import { Logger } from '../logUtils';
import * as fs from 'fs';

//files
// import { URLHandler } from "./URLHandler";

/**
 * Stuff with  more arguments.
 * @method gitClone
 * @param {string} url: link to github repositor
 * @param {string} repoFolder Argument two enz.
 */
export function gitClone(url: string, repoFolder: string){
    
    try{
        // Check if tmp folder is made:
        if (!fs.existsSync(path.resolve('utils' , '../tmp'))){
            fs.mkdirSync(path.resolve('utils' , '../tmp'));
        }

        const command = `git clone ${url} ${repoFolder ? repoFolder : ''}`;

        //run the command in terminal, ensure that git clones to current working directory
        const result = execSync(command, {stdio: ['pipe', 'pipe', 'pipe'], encoding: 'utf8', cwd: path.resolve('utils' , '../tmp')})

        Logger.logInfo(result);
        Logger.logInfo('Your repository cloned successfully :)');

    } catch(error){
        Logger.logInfo('Your repository failed to clone :( ');
        if (error instanceof Error) {
            Logger.logInfo(error.message);
        }
        Logger.logDebug('Full Error Stack:\n' + (error as any).stack);
    }
}