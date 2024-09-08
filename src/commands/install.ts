import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync } from 'fs';
import { join } from 'path';

const execPromise = promisify(exec);

const packageJsonPath = join(__dirname, '../../package.json');

/**
 * Installs regular dependencies and development dependencies for project-f2024
 */
export async function installDependencies() {
  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

    console.log('Installing Dependencies...\n', packageJson.dependencies);
    console.log('Installing DevDependencies...\n', packageJson.devDependencies);

    const { stdout, stderr } = await execPromise('npm install');
    
    console.log(stdout);
    if (stderr) {
      console.error(`Installation Error: ${stderr}`);
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error('Installation failed:', error);
    process.exit(1);
  }
}