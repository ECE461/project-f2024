# project-f2024

## Project Purpose:
This repository is an implementation of a command line tool which aims to help developers choose reliable open-source modules. By analyzing data from GitHub, it evaluates modules based on important factors like ease of use, correctness, contributor activity, responsiveness, and license compatibility.

Our goal is to simplify the process of assessing open-source software.

## Usage:
### `./run install`
* Installs all dependencies required for project-f2024 reposistory

### `./run <url_file>`
* Scores npm or Github URLs inside <url_file>
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
1. Install Dependencies: `./run install`
2. Setup environment variables
    1. LOG_FILE (see [Logging](#Logging) section)
    2. LOG_LEVEL (see [Logging](#Logging) section)
    3. GITHUB_TOKEN (required)
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
3. Run unit tests or evalutate models (see [Usage](#Usage) section)

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
* This score measures the responsiveness of contributors within last three months
* Calculated using average response times for issues and pull requests i.e. time from open to close
### Metric
* Abstract class used to structure the five metrics
### Net Score
* Calculated as a net score between the five metrics
* Weights:
    * TODO: fill in
## External Dependencies
* **axios**: A promise-based HTTP client for making requests to the npm Registry and GitHub REST APIs. It simplifies the process of handling asynchronous requests and managing responses, making it easier to interact with external services.
* **isomorphic-git**: A JavaScript library that allows for shallow cloning of Git repositories in both browser and Node.js environments.
* **minimist**: A lightweight module for parsing command-line arguments. It enables easy extraction of arguments from the CLI, allowing for flexible and user-friendly command-line interfaces in your application.

## Logging
* **LOG_LEVEL**
    * `0` (default) : Silent
    * `1` : Only displays information messages
    * `2` : Diplays information and debug messages
* **LOG_FILE**: Location of log output
    * Default is default.log

## Structure
* `src`
     * `commands`   Contains functions called for each CL argument
     * `metrics`    Contains classes for each metric
     * `utils`      Contains helper functions for URL and cloning
 * `test`
