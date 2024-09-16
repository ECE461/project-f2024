import { URLHandler } from '../urlUtils/URLHandler';
// Metric Class
// has score variable, getScore, calculateScore, and url
// Abstract Class
export abstract class Metric {
    score: number;
    url: URLHandler;
    constructor(url: URLHandler) {
        this.score = 0;
        this.url = url;
    }
    abstract calculateScore(): number; 
    getURL(): URLHandler {
        return this.url;
    }
}
