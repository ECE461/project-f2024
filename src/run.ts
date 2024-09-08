import minimist from 'minimist';
import { promises as fs } from 'fs';

// TODO: Move this to separate file and fully implement
// TODO: Need to check that env variables are set
async function handleUrlFile(urlFile: string) {
  console.log(`Processing file: ${urlFile}`);
  try {
    const data = await fs.readFile(urlFile, 'utf-8');
    console.log('File content:', data);
  } catch (error) {
    if (error instanceof Error) {
        console.error('Error reading file:', error.message);
    } else {
        console.error('An unknown error occurred');
    }
  }
}

const usage = `
Usage: node run.js [command] [options]

Commands:
  install       Install dependencies
  tests         Run tests
  <url_file>.txt    Process a text file

Options:
  --help        Show this help message
`;

async function main() {
  // Parse command line arguments
  const args = minimist(process.argv.slice(2));

  if (args._.length === 0) {
    console.log(usage);
    process.exit(1);
  }

  const command = args._[0];

  switch (command) {
    case 'tests':
      console.log('Running tests...');
      break;
    default:
      if (command.endsWith('.txt')) {
        await handleUrlFile(command);
      } else {
        console.log(usage);
      }
  }
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});