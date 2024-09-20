//modules
import * as git from 'isomorphic-git';
import * as fs from 'fs'; //file system to r/w repo data
import * as http from 'isomorphic-git/http/node'; //http requests
import * as path from 'path';

import { URLHandler } from './URLHandler';
import { Logger } from '../logUtils';

/**
 * Stuff with  more arguments.
 * @method folderExists: checks whether a folder exists at the given path, if not, it creates the folder. otherwise 
 *                       it doesn't do anything.
 * @param {string} path: provided path
 */
export function folderExists(path: string){
    
    if(!fs.existsSync(path)){
        fs.mkdirSync(path, {recursive: true});
        return;
    }

}

/**
 * Stuff with  more arguments.
 * @method gitClone: uses isomorphic-git to clone remote repositories. you can find the cloned respositories under 
 *                   project-f2024/cloned_repos/{repository-name}
 * @param {string} url: link to github repositor
 * @param {string} filename 
 */
export async function gitClone(url: URLHandler){

    //cd.. back into project-f2024 folder
    const proj_folder = path.join(__dirname, '../../');
    
    //create a new file in project-
    const repo_folder = path.join(proj_folder, 'cloned_repos');
    folderExists(repo_folder);

    //create a new file in the current cwd
    const cloned_folder = path.join(repo_folder + "/", url.getRepoName()); 
    folderExists(cloned_folder);
    
    try{    
        await git.clone({fs, http, dir: cloned_folder, url: url.url, singleBranch: true, depth: 1})
        console.log('successfully git cloned ', url.getRepoName());
    }
    catch(Error){
        console.error('unsuccessful git clone'); 
        Logger.logDebug(Error);
    }

}

gitClone(new URLHandler('https://github.com/monkeytypegame/monkeytype.git'));
gitClone(new URLHandler('https://github.com/tianayjlin/dummy_repo'));

