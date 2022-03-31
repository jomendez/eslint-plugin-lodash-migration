const arg = require('arg');
const fs = require('fs');
const main = require('./main');
const unifyImports = require('./unify-imports');
const { default: chalk } = require('chalk');

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--path': String,
      '-p': '--path',
      '--individual-imports': Boolean,
      '-i': '--individual-imports',
      '-h': Boolean
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    path: args['--path'] || '',
    help: args['-h'] || false,
    individualImports: args['--individual-imports'] || false
  };
}

module.exports = {
  async cli(args) {
    const options = parseArgumentsIntoOptions(args);

    const optionsHelp = Object.entries(options).some(([key, value]) => key === 'help' && value);
    if (optionsHelp) {
      console.log('\n');
      console.log('Use this command with params --path/-p to specify the path to the project you want to migrate lodash');
      console.log('eg: migrate-lodash -p <path-to-yout-project>/src');
      return;
    }

    if (options.path) {
      if (!fs.existsSync(options.path)) {
        console.log('\n');
        console.error(chalk.red(`Path provided doesn't exist: ${options.path}`));
        return;
      }

      try {
        await main(options.path)
      } catch (error) {
        process.exitCode = 1;
        console.error(error);
      }
      
      if (!options.individualImports) {
        try {
          await unifyImports(options.path)
        } catch (error) {
          process.exitCode = 1;
          console.error(error);
        }
      }
    }
  }
}
