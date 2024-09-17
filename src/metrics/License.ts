import {Metric} from './Metric';
import { URLHandler } from '../utils/URLHandler';

export class License extends Metric {
    jsonKey: string = "License";

    constructor(url: URLHandler) {
        super(url);
    }
    calculateScore(): void {
        this.score = Math.random()*10;
    }
}