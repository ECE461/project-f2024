import {Metric} from './Metric';
import { URLHandler } from '../utils/URLHandler';

export class BusFactor extends Metric {
    jsonKey: string = "BusFactor";

    constructor(url: URLHandler) {
        super(url);
    }

    async calculateScore(): Promise<void> {

        this.startTimer();
        
        //checks existence of cloned repository



        
        this.score = Math.random() * 10;

        // End timer for latency
        this.endTimer();

    }
}