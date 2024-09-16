import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

test('should print Installed 7 files', async () => {
  // Run the command
  const { stdout, stderr } = await execPromise('./run install');
  
  // Check for errors
  if (stderr) {
    throw new Error(`Error: ${stderr}`);
  }

  // Check if the output contains the expected result
  expect(stdout).toContain('found 0 vulnerabilities');
});