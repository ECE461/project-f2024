import { URLHandler } from "../utils/URLHandler";
import { Metric } from "./Metric";
import { NetScore } from '../metrics/NetScore';



export function createNDJsonResult(netScore: NetScore, metrics: Metric[]) : string {
    let result = { URL: metrics[0].getURLHandler().getURL()};
    Object.assign(result, netScore.getJsonObject());

    metrics.forEach(metric => {
        Object.assign(result, metric.getJsonObject());
    });
    return JSON.stringify(result) + '\n';
}