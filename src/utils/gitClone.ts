//modules
import {execSync} from 'child_process'; //used to write shell commands 
import * as path from 'path'; 

//files
import { URLHandler } from "./URLHandler";

/**
 * Stuff with  more arguments.
 * @method gitClone
 * @param {string} url: link to github repositor
 * @param {string} filename Argument two enz.
 */
export function gitClone(url: string, filename: string){
    
    try{
        
        const command = `git clone ${url} ${filename ? filename : ''}`;

        //run the command in terminal, ensure that git clones to current directory
        execSync(command, {stdio: 'inherit', path.resolve('utils' , '../../')})

        console.log('your repository cloned successfully');


    } catch(error){
        console.log('your repository failed to clone :(');
    }
}

gitClone('https://github.com/me50/tianayjlin.git', )