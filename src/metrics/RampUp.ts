import {Metric} from './Metric';
import { URLHandler } from '../utils/URLHandler';

export class RampUp extends Metric {
    jsonKey: string = "RampUp";

    constructor(url: URLHandler) {
        super(url);
    }
    calculateScore(): void {
        // Start timer for latency
        this.startTimer();

        this.score = Math.random();
 
        // End timer for latency
        this.endTimer();
    }
}