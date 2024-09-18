import {Metric} from './Metric';
import { URLHandler } from '../utils/URLHandler';

export class BusFactor extends Metric {
    jsonKey: string = "BusFactor";

    constructor(url: URLHandler) {
        super(url);
    }
    async calculateScore(): Promise<void> {
        this.score = Math.random()*10;
    }
}