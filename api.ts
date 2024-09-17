import { Response } from 'node-fetch';

const repoUrl = 'https://api.github.com/repos/mrdoob/three.js';

async function fetchRepoInfo(): Promise<void> {
    try {
        const response: Response = await fetch(repoUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log(data);
    } catch (error) {
        console.error('Error fetching repository information:', error);
    }
}

fetchRepoInfo();
