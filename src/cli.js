const arg = require('arg');
const fs = require('fs');
const main = require('./main');

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--path': String,
      '-p': '--path',
      '-h': Boolean
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    path: args['--path'] || '',
    help: args['-h'] || false
  };
}

module.exports = {
  cli(args) {
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
        console.error(`Path provided doesn't exist: ${options.path}`);
        return;
      }
      // perform migration here
      main(options.path)
        .then()
        .catch((error) => {
          process.exitCode = 1;
          console.error(error);
        });
    }
  }
}
