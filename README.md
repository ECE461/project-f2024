# project-f2024

## Overview:
This repository is an implementation of a command line tool used to score npm and github modules in terms of reliability.

## Usage:
### `./run install`
* Installs all dependencies required for project-f2024 reposistory

### `./run <url_file>.txt`
* Scores npm or Github URLs inside <url_file>.txt
* Sample Input File:
    ```
    https://www.npmjs.com/package/commander
    https://www.npmjs.com/package/command-line-args
    https://github.com/yargs/yargs
    ```
* Outputs net and individual scores as well as latency to stdout in NDJSON format
* Sample Output:
    ```
    {"URL":"https://www.npmjs.com/package/express", "NetScore":0, "NetScore_Latency": 0.133,"RampUp":0.5,"RampUp_Latency": 0.002, "Correctness":0.7, "Correctness_Latency":0.076, "BusFactor":-1, "BusFactor_Latency":-1, "ResponsiveMaintainer":0.6, "ResponsiveMaintainer_Latency": 0.009, "License":0, "License_Latency": 0.046}
    ```
### `./run test`
* Runs tests on project-f2024 repository using jest
* Test can be found in /test directory
* Sample Output:
    ```
    Total: 10
    Passed: 9
    Coverage: 90%
    9/10 test cases passed. 90% line coverage achieved.
    ```

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
    * Setting in command line (Linux):
        ```
        export LOG_LEVEL=2
        ```

## Scoring
All scores are calculated between 0 and 1 (inclusive), a higher score corresponds to a better implementation of the metric within a repository. If the module fails to calculate the score, the score is set to -1.
### Bus Factor
   Bus factor is defined by "the minimum number of team members that have to suddenly disappear from a project before the project stalls due to lack of knowledgeable or competent personnel" (Source: Wikipedia).
### Correctness
### License
### Ramp Up
* High score indicates low ramp up time required
* Measured by ratio of documentation to code
* Target ratio is smaller for smaller projects as it is assumed that looking through the code itself will be easier as compared to a larger project
### Responsiveness
* High score indicates that contributors have shown responsiveness within last three months
* Measured by average response times for issues and pull requests i.e. time from open to close
### Metric
* Abstract class used to structure the five metrics
### Net Score
* Calculated as a net score between the five metrics
* Weights:
    * TODO: fill in
## External Dependencies
* axios:            used for npm Registry and GitHub REST API calls
* isomorphic-git:   used to shallow clone repositories to get data
* minimist:         used to parse CLI arguments
## Structure
* `src`
     * `commands`   Contains functions called for each CL argument
     * `metrics`    Contains classes for each metric
     * `utils`      Contains helper functions for URL and cloning
 * `test`
