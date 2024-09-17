import {Metric} from './Metric';
import { URLHandler } from '../urlUtils/URLHandler';

export class RampUp extends Metric {
    jsonKey: string = "RampUp";

    constructor(url: URLHandler) {
        super(url);
    }
    calculateScore(): void {
        this.score = Math.random()*10;
    }
}