import {Metric} from './Metric';
import { URLHandler } from '../utils/URLHandler';
import axios from 'axios';
import { Logger } from '../logUtils';

export class RampUp extends Metric {
    jsonKey: string = "RampUp";
    readonly programming_ext = [".js", ".ts", ".py", ".java", ".cpp", ".c", ".cs", ".rb", ".php"];

    constructor(url: URLHandler) {
        super(url);
    }

    async calculateScore(): Promise<void> {
        // Start timer for latency
        this.startTimer();

        // Convert the base url to an API url
        const apiBase = "https://api.github.com/repos";
        const urlParts = this.url.getRepoURL().split('github.com/')[1].split('/');
        const owner = urlParts[0];
        const repo = urlParts[1];
        let apiEndpoint = `${apiBase}/${owner}/${repo}/contents`;
        // Make API calls to get the file information
        try {
            const response = await axios.get(apiEndpoint, {headers: {'Authorization': `token ${process.env.GITHUB_TOKEN}`}});
            
            const files = response.data;
            let docs_folder = null;
            let examples_folder = null;
            let source_folder = null
            let total_code_size = 0;
            let total_documentation_size = 0;

            // Get the size of the README and CHANGELOG files and check for docs and examples folders
            files.forEach((file: any) => {
                if (file.name.toLowerCase() === 'readme.md' || file.name.toLowerCase() === 'changelog.md') {
                    total_documentation_size += file.size;
                }
                else if (file.type === 'dir' && (file.name.toLowerCase() === 'docs' || file.name.toLowerCase() === 'doc' || file.name.toLowerCase() === 'documentation' || file.name.toLowerCase() === 'documents')) {
                    docs_folder = file.name;
                }
                else if (file.type === 'dir' && (file.name.toLowerCase() === 'examples' || file.name.toLowerCase() === 'sample' || file.name.toLowerCase() === 'samples' || file.name.toLowerCase() === 'demos' || file.name.toLowerCase() === 'example')) {
                    examples_folder = file.name;
                }
                else if (file.type === 'dir' && (file.name.toLowerCase() === 'src' || file.name.toLowerCase() === 'source' || file.name.toLowerCase() === 'code' || file.name.toLowerCase() === 'lib')) {
                    source_folder = file.name;
                }
                else if (file.type === 'file' && this.programming_ext.some(ext => file.name.endsWith(ext))) {
                    total_code_size += file.size;
                }
            });

            if(docs_folder) {
                const documents = await axios.get(`${apiEndpoint}/${docs_folder}`, {headers: {'Authorization': `token ${process.env.GITHUB_TOKEN}`}});
                documents.data.forEach((doc: any) => {
                    total_documentation_size += doc.size;
                });
            }
            if(examples_folder) {
                const examples = await axios.get(`${apiEndpoint}/${examples_folder}`, {headers: {'Authorization': `token ${process.env.GITHUB_TOKEN}`}});
                examples.data.forEach((example: any) => {
                    total_documentation_size += example.size;
                });
            }
            if(source_folder) {
                // peform a 2-depth recursive search for source code files
                total_code_size += await this.getRepoProgramFileCounts(apiEndpoint, source_folder);
            }


            if(total_documentation_size === 0) {
                this.score = -1;
            }
            else {
                const ramp_up_ratio = (total_documentation_size / total_code_size);

                // for smaller projects
                if(total_code_size < 10000)
                {
                    this.score = (ramp_up_ratio * 5 > 1) ? 1 : ramp_up_ratio * 5;
                    // if 1 line of documentation per 5 lines of code, score is ~1
                }
                else
                {
                    this.score =  (ramp_up_ratio * 1.5 > 1) ? 1 : ramp_up_ratio * 1.5;
                    // if 2 lines of documentation per 3 lines of code, score is ~1
                    // this is higher because larger projects should have more documentation and examples (many lines)
                }
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 401) {
                    console.error("Invalid or expired Github token");
                }
                else {
                    console.error('An error occured: ', error.message);
                }
            }
            Logger.logDebug('Error getting repository files and sizes');
            Logger.logDebug(error);
            this.score = -1;
        }

        // End timer for latency
        this.endTimer();
    }

    async getRepoProgramFileCounts(baseApiUrl: string, path: string="", currentDepth: number = 0, maxDepth: number = 2): Promise<number> {
        let apiEndpoint = `${baseApiUrl}/${path}`;
        let total_code_size = 0;

        try {
            const response = await axios.get(apiEndpoint, {headers: {'Authorization': `token ${process.env.GITHUB_TOKEN}`}});
            const contents = response.data;

            contents.forEach(async (item: any) => {
                if(item.type === 'dir')
                {
                    if(currentDepth < maxDepth) {
                        total_code_size += await this.getRepoProgramFileCounts(baseApiUrl, item.path, currentDepth + 1, maxDepth);
                    }
                }
                else if(item.type === 'file' && this.programming_ext.some(ext => item.name.endsWith(ext))) {
                    total_code_size += item.size;
                }
            });

            return total_code_size;

        } catch (error) {
            Logger.logInfo('Error getting repo files and sizes');
            Logger.logDebug(error);

            return 0;
        }
    }
}