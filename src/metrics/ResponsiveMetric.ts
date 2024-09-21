import {Metric} from './Metric';
import { URLHandler } from '../utils/URLHandler';
import axios from 'axios';
import { Logger } from '../logUtils';

export class ResponsiveMetric extends Metric {
    jsonKey: string = "ResponsiveMaintainer";

    constructor(url: URLHandler) {
        super(url);
    }

    /**
     * @Method calculateScore
     * @return {Promise<void>} A promise that resolves when the score calculation is complete.
     * @description
     * Calculates the responsive metric score by analyzing the response times for PRs and Issues.
     * The score is based on the average response time of the PRs and Issues.
     */
    async calculateScore(): Promise<void> {
        // Start timer for latency
        this.startTimer();
        try {
            Logger.logDebug(`Calculating Responsive Metric Score for:  ${this.url.getRepoURL()}`);

            const gitToken = process.env.GITHUB_TOKEN;

            let issuesApiEndpoint = `${this.url.getBaseAPI()}/issues`;
            let prApiEndpoint = `${this.url.getBaseAPI()}/pulls`;

            // Calculate two months ago date
            const today = new Date();
            const twoMonthsAgo = new Date(today.setMonth(today.getMonth() - 2)).toISOString();

            // Get issues
            const issuesResponse = await axios.get(issuesApiEndpoint, {
                headers: { Authorization: `Bearer ${gitToken}` },
                params: { state: 'all', since: twoMonthsAgo }
            });

            // Get pull requests
            const pullRequestsResponse = await axios.get(prApiEndpoint, {
                headers: { Authorization: `Bearer ${gitToken}` },
                params: { state: 'all' }
            });

            const issues = issuesResponse.data;
            const pullRequests = pullRequestsResponse.data;

            const allResponseTimes: number[] = [];

            // If no issues or pull requests, set score to 0
            if (issues.length === 0 && pullRequests.length === 0) {
                this.score = 0;
            }
            else {

                // Calculate response times for issues and pull requests
                for (const issue of issues) {
                    if (issue.comments > 0 && issue.closed_at) {
                    const createdAt = new Date(issue.created_at).getTime();
                    const closedAt = new Date(issue.closed_at).getTime();
                    allResponseTimes.push(closedAt - createdAt);
                    }
                }
                for (const pr of pullRequests) {
                    if (pr.comments > 0 && pr.closed_at) {
                    const createdAt = new Date(pr.created_at).getTime();
                    const closedAt = new Date(pr.closed_at).getTime();
                    allResponseTimes.push(closedAt - createdAt);
                    }
                }

                // Calculate the average response time
                const totalTime = allResponseTimes.reduce((a, b) => a + b, 0);
                const avgResponseTime = totalTime / allResponseTimes.length;

                Logger.logDebug(`Issues/PRs Response Total Time: ${totalTime}`);
                Logger.logDebug(`Issues/PRs Average Response Time: ${avgResponseTime}`);

                const minResponseTime = 1000 * 60 * 60 * 24; // 1 day in milliseconds
                const maxResponseTime = 1000 * 60 * 60 * 24 * 30; // 30 days in milliseconds

                // Adjust the score to account for more gradual scaling
                if (avgResponseTime) {
                    // Cap the avgResponseTime between minResponseTime and maxResponseTime
                    const cappedResponseTime = Math.max(minResponseTime, Math.min(avgResponseTime, maxResponseTime));
                    const normalizedTime = (cappedResponseTime - minResponseTime) / (maxResponseTime - minResponseTime);

                    // Normalize the response time between 0 and 1
                    const k = 8;
                    this.score = 1 / (1 + Math.exp(k * (normalizedTime - 0.5)));
                } else {
                    // If no response times found, set score to 0
                    this.score = 0;
                }

                // Make sure the score doesn't go below 0 or above 1
                this.score = Math.max(0, Math.min(this.score, 1));
            }
        } catch (error) {
            Logger.logInfo(`Error in calculating ResponsiveMaintainer metric... Score set to -1... Repo Name: ${this.url.getRepoName()}`);
            Logger.logDebug(error);
        } 
        // End timer for latency
        this.endTimer();
    }
}