import {Metric} from './Metric';
import { URLHandler } from '../utils/URLHandler';

export class ResponsiveMetric extends Metric {
    jsonKey: string = "ResponsiveMaintainer";

    constructor(url: URLHandler) {
        super(url);
    }
    async calculateScore(): Promise<void> {
        // Start timer for latency
        this.startTimer();

        this.score = Math.random();

        // End timer for latency
        this.endTimer();
    }
}