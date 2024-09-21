import { ResponsiveMetric } from '../../src/metrics/ResponsiveMetric';
import { URLHandler } from '../../src/utils/URLHandler';

describe ('ResponsiveMetric', () => {

    // Test 1: Test the constructor
    // Expect: score = -1, url !== null, latency = -1, start = -1
    it('should create a new ResponsiveMetric object', () => {
        const url = new URLHandler('https://github.com/yargs/yargs');
        url.setRepoURL();
        const responsiveMetric = new ResponsiveMetric(url);
        expect(responsiveMetric.getScore()).toBe(-1);
        expect(responsiveMetric.getURLHandler()).not.toBeNull();
        expect(responsiveMetric.latency).toBe(-1);
        expect(responsiveMetric.start).toBe(-1);
        expect(responsiveMetric.jsonKey).toBe('ResponsiveMaintainer');
        expect(responsiveMetric.getJsonObject()).toEqual({'ResponsiveMaintainer': -1, 'ResponsiveMaintainer_Latency': -1});

    });

    // Test 2: Test calculateScore() on repo with no issues/PR
    // Expect: score = 0
    it('should calculate score of 0 for a URL with no issues/PR', async () => {
        const url = new URLHandler('https://www.npmjs.com/package/unlicensed');
        await url.setRepoURL();
        const responsiveMetric = new ResponsiveMetric(url);
        await responsiveMetric.calculateScore();
        expect(responsiveMetric.getScore()).toBe(0);
    });

    // Test 3: Calculate score on repo with high responsiveness
    // Expect: score > 0.5
    it('should calculate score > 0.5 for a URL with high responsiveness', async () => {
        const url = new URLHandler('https://github.com/mrdoob/three.js');
        await url.setRepoURL();
        const responsiveMetric = new ResponsiveMetric(url);
        await responsiveMetric.calculateScore();
        expect(responsiveMetric.getScore()).toBeGreaterThan(0.5);
    });

    // Test 4: Calculate score on repo with low responsiveness
    // Expect: score < 0.5
    it('should calculate score < 0.5 for a URL with low responsiveness', async () => {
        const url = new URLHandler('https://github.com/yargs/yargs');
        await url.setRepoURL();
        const responsiveMetric = new ResponsiveMetric(url);
        await responsiveMetric.calculateScore();
        expect(responsiveMetric.getScore()).toBeLessThan(0.5);
    });

});