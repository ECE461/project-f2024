import { URLHandler } from '../utils/URLHandler';
// Metric Class
// has score variable, getScore, calculateScore, and url
// Abstract Class
export abstract class Metric {
    score: number;
    url: URLHandler;
    latency: number;
    abstract jsonKey: string;

    constructor(url: URLHandler) {
        this.score = 0;
        this.url = url;
        this.latency = 0;
    }

    abstract calculateScore(): void; 

    getScore(): number {
        return this.score;
    }

    getURL(): URLHandler {
        return this.url;
    }

    public getMetricObject(): Object {
        return {
            [this.jsonKey]: this.score,
            [this.getJSONLatencyKey()]: this.latency
        }
    }
    
    private getJSONLatencyKey(): string {
        return `${this.jsonKey}_Latency`;
    }
}
