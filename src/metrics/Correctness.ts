import {Metric} from './Metric';
import { URLHandler } from '../utils/URLHandler';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @class Correctness
 * @description
 * The Correctness class is responsible for calculating the correctness score of a repository.
 * The correctness score is determined based on the ratio of closed issues to total issues.
 * This class extends the Metric class and provides methods to calculate the score by
 * analyzing the repository's issues.
 *  
 * @example
 * // Creating an instance of Correctness
 * const urlHandler = new URLHandler('https://github.com/user/repo');
 * const correctness = new Correctness(urlHandler);
 * 
 * // Calculating the correctness score
 * await correctness.calculateScore();
 * 
 * @param {URLHandler} url - An instance of URLHandler to handle URL-related operations.
 * 
 * @method calculateScore(): Promise<void>
 * Calculates the correctness score by analyzing the repository's issues.
 * 
 * @method getIssueCountByState(state: 'open' | 'closed'): Promise<number>
 * Fetches the count of issues in the repository based on the state (open or closed).
 * 
 * @method getIssueCounts(): Promise<[number, number]>
 * Fetches the count of open and closed issues in the repository.
 * 
 */
export class Correctness extends Metric {
    jsonKey: string = "Correctness";

    constructor(url: URLHandler) {
        super(url);
    }

    /**
     * @method calculateScore
     * @return {Promise<void>} A promise that resolves when the score calculation is complete.
     * @description
     * Calculates the correctness score by analyzing the repository's issues.
     * The score is based on the ratio of closed issues to total issues.
     */
    async calculateScore(): Promise<void> {
        try {
        // Start timer for latency
        this.startTimer();

        const [openCount, closedCount] = await this.getIssueCounts();
        

        const totalIssues = openCount + closedCount;

            // Calculate the correctness score (Closed Issues / Total Issues)
            if (totalIssues > 0) {
                this.score = (closedCount / totalIssues) ; // Percent correctness
            } else {
                this.score = 0; // If there are no issues, correctness is 0
            }


        // End timer for latency
        this.endTimer();

        } catch (error) {
            console.error('Error calculating correctness score:', error);
            this.score = 0; // Set score to 0 if there's an error
        }
    }

    /**
     * @method getIssueCountByState
     * @param {string} state - The state of the issues to fetch ('open' or 'closed').
     * @return {Promise<number>} The count of issues in the repository based on the state.
     * @description
     * Fetches the count of issues in the repository based on the state (open or closed).
     */
    async getIssueCountByState(state: 'open' | 'closed'): Promise <number> {
        try{
            const repoName = this.url.getRepoName();
            
            console.log(`Repo Name: ${repoName}`);

            // const repoOwner = this.url.getOwnerName();
            const repoOwner =this.url.getOwnerName();
            console.log(`Repo Owner: ${repoOwner}`);
            const repoFullName = `${repoOwner}/${repoName}`;
            const apiURLIssue = `https://api.github.com/search/issues?q=repo:${repoFullName}+is:issue+state:${state}`;

            
            console.log(`Fetching ${state} issues from: ${apiURLIssue}`);
            const issuesResponse = await axios.get(apiURLIssue,{
                headers: {
                    
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`},
                
            });

            const totalIssues = issuesResponse.data.total_count;
        

            return totalIssues
        }catch(error){
            if(axios.isAxiosError(error)){
                console.error(`Error fetching ${state} issues:`, error.response?.data);
            } else {
                console.error('Unknown error:', error);};
            return -1;
        }
    }

    /**
     * @method getIssueCounts
     * @return {Promise<[number, number]>} A promise that resolves to an array containing the count of open and closed issues.
     * @description
     * Fetches the count of open and closed issues in the repository.
     */
    async getIssueCounts(): Promise<[number,number]> {
        try {
        
            const openCount = await this.getIssueCountByState('open');
            const closedCount = await this.getIssueCountByState('closed');
    
            console.log(`Open Issues: ${openCount}`);
            console.log(`Closed Issues: ${closedCount}`);

            return [openCount, closedCount];
        } catch (error) {
            console.error('Error getting issue counts:', error);
            return [-1, -1];
        }
    }
    };

  
