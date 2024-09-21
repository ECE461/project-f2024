import {Metric} from './Metric';
import { URLHandler } from '../utils/URLHandler';
import axios from 'axios';
import { Logger } from '../logUtils';
import { DatabaseSync } from 'node:sqlite';
import dotenv from 'dotenv';
import { Console } from 'node:console';


dotenv.config();

export class BusFactor extends Metric {
    jsonKey: string = "BusFactor";

    constructor(url: URLHandler) {
        super(url);
    }

    /**
     * @async @function calculateScore()
     * @return {Promise<void>}
     * @description: thie function calculates the bus factor on a github repository as part of the final metrics evaluation. 
     *               the endpoint /stats/contributors is used to gather lines by largest contributor, total lines changed, 
     *               number of commits by largest contributor, and total commits. 
     */
    async calculateScore(): Promise<void> {

        //start timer 
        this.startTimer();
        
        //stats/contributors endpoint 
        let ep = this.url.getBaseAPI() + "/contributors";
        console.log("busfactor endpoint: " + ep); 

        
        //metrics values need (explicitly typed or else will be interpreted as boolean)
        //hc stands for 'highest contributor', defined as individual with most commits, not necessarily most lines
        let total_commits: number = 0; 
        let hc_commits = 0; 
        // let total_lines = 0; 
        // let hc_lines = 0;

        let author:string; 
        try{
            //make api call to ep to return container of objects.
            const response = await axios.get(ep, {headers: {'Authorization': `token ${process.env.GITHUB_TOKEN}`}}); 
            const data = response.data; 
            if(data == null){
                this.score = -1; 
                return;
            }
            // console.log(typeof(response)); 
            //iterate through each contributor data
            
            data.forEach((contributor : any) =>{
                
                //add to total commits
                total_commits += contributor.contributions; 
                console.log(`contributor contributions: ${contributor.contributions}`);
                //get highest contributor (change if needed)
                if(contributor.contributions > hc_commits){
                    hc_commits = contributor.contributions; 
                    author = contributor.login; //record this to determine whether to change hc_lines
                    hc_lines = 0; //reset highest contributor lines for later iteration
                }

                //get total lines
                // contributor.weeks.forEach((week : any) => {
                //     total_lines += week.a + week.d;
                    
                //     //total lines from highest contributor
                //     if (author == contributor.login){
                //         hc_lines += week.a + week.d; 
                //     }
                // });
            });

        }catch(Error){ 
            console.log(Error);
            Logger.logDebug("Bus Factor: Error fetching bus factor data from repository\n" + Error);
            this.score = -1; 
            this.endTimer(); 
            return;
        }

        this.score = 1 - 0.5 * (hc_commits / total_commits);

        //one is the maximum value 
        this.score = this.score > 1 ? 1 : this.score; 
    
        // End timer for latency
        this.endTimer();
    }
}
