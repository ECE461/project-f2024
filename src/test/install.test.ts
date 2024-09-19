import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

describe('Run install script', () => {
  describe('Run install valid', () => {
    it('should print "found 0 vulnerabilities" and "Dependencies installed successfully"', async () => {
      // Run the command
      const { stdout: stdout, stderr:stderr } = await execPromise('./run install');
      
      // Check for errors
      if (stderr) {
        throw new Error(`Error: ${stderr}`);
      }

      console.log(stdout);
      // Check if the output contains the expected result
      expect(stdout).toContain('Dependencies installed successfully');
    });
  });

  describe('Run install no permission', () => {
    beforeAll(async () => {
      await execPromise('chmod -w ./node_modules');
    });
    afterAll(async () => {
      await execPromise('chmod +w ./node_modules');
    });
    it('should error with a non-zero exit code and output "Error: npm install failed"', async () => {
      try {
        const { stdout: stdout, stderr:stderr } = await execPromise('./run install');

        fail('Expected the script to fail but it succeeded');
      } catch (error: any) {;
        expect(error.code).not.toBe(0);
        expect(error.stderr).toContain('Error: ./run install failed with exit code ');
      }
    });
  });
});
