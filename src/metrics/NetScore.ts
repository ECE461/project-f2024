import { URLHandler } from '../urlUtils/URLHandler';
import { BusFactor } from './BusFactor';
import { Correctness } from './Correctness';
import { RampUp } from './RampUp';
import { ResponsiveMetric } from './ResponsiveMetric';
import { License } from './License';

export class NetScore{
    jsonKey: string = "NetScore";
    
    calculateScore(busFactor: BusFactor, correctness: Correctness, liscene: License, rampUp: RampUp, respMet: ResponsiveMetric): number {
        const busWeight = 0.2;
        const correctnessWeight = 0.2;
        const licenseWeight = 0.2;
        const rampUpWeight = 0.2;
        const respMetWeight = 0.2;

        const netScore = busFactor.getScore() * busWeight + correctness.getScore() * correctnessWeight + liscene.getScore() * licenseWeight + rampUp.getScore() * rampUpWeight + respMet.getScore() * respMetWeight;
        return netScore;
    }
}