# project-f2024

## Setup:
1. Install Dependencies: `./run install` or `npm install`
2. Build the project (compile js scripts): `npm run build`
3. Setup environment variables
    * Location of logs : LOG_FILE
    * LOG_LEVEL
        * `0` (default) : silent
        * `1` : info messages
        * `2` : debug messages
    * GITHUB_TOKEN
    * Sample .env file:
        ```
        # To activate: ". .env"
        LOG_LEVEL=1
        LOG_FILE="log.log"
        GITHUB_TOKEN="gh*****"`
        ```
    

## Uses:
### `./run <url_file>.txt`
* Scores npmjs.com domain or GitHub repository URLs
* Outputs net and individual scores to stdout in NDJSON format
* Sample Output:
    ```
    {"URL":"https://www.npmjs.com/package/express", "NetScore":0, "NetScore_Latency": 0.133,"RampUp":0.5,"RampUp_Latency": 0.002, "Correctness":0.7, "Correctness_Latency":0.076, "BusFactor":-1, "BusFactor_Latency":-1, "ResponsiveMaintainer":0.6, "ResponsiveMaintainer_Latency": 0.009, "License":0, "License_Latency": 0.046}
    ```
### `./run test`
* Runs tests on code
* Sample Output:
    ```
    Total: 10
    Passed: 9
    Coverage: 90%
    9/10 test cases passed. 90% line coverage achieved.
    ```
## Scoring:
All scores will be between 0 and 1 (inclusive), a higher score corresponds to a better implementation of the metric within a repository.
### Bus Factor
### Correctness
### License
### Metric
### Ramp Up
* High score indicates low ramp up time required
* Measured by ratio of documentation to code
* Target ratio is smaller for smaller projects as it is assumed that looking through the code itself will be easier as compared to a larger project
### Responsiveness
### Net Score
## Structure
* `src`
     * `commands`
     * `metrics`
     * `test`
     * `utils`
