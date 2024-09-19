import { URLHandler } from '../utils/URLHandler';
// Metric Class
// has score variable, getScore, calculateScore, and url
// Abstract Class
export abstract class Metric {
    score: number;
    url: URLHandler;
    latency: number;
    start: number;
    abstract jsonKey: string;

    constructor(url: URLHandler) {
        this.score = 0;
        this.url = url;
        this.latency = 0;
        this.start = 0;
    }

    abstract calculateScore(): void; 

    getScore(): number {
        return this.score;
    }

    public getURLHandler(): URLHandler {
        return this.url;
    }

    public getJsonObject(): Object {
        return {
            [this.jsonKey]: this.score,
            [this.getJSONLatencyKey()]: this.latency
        }
    }

    private getJSONLatencyKey(): string {
        return `${this.jsonKey}_Latency`;
    }

    public startTimer(): void {
        this.start = Date.now();
    }

    public endTimer(): void {
        this.latency = Date.now() - this.start;
    }
}
