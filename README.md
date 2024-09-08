# project-f2024

## Setup:
1. Install Dependencies: `./run install`
2. Build the project (compile js scripts): `npm run build`
3. Setup environment variables
    -- Location of logs : LOG_FILE
    -- LOG_LEVEL (0 (default) : silent, 1 : info messages, 2 : debug messages)
    -- GITHUB_TOKEN

## Uses:
### `./run <url_file>.txt`
    - Scores npmjs.com domain or GitHub repository URLs
    - Outputs net and individual scores to 