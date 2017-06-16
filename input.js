const yargs = require('yargs');

module.exports = (input) => {
  const y = yargs.usage(`\nUsage: re|react [path] [options]`)
    .options(input)
    .locale('en')
    .help('h');

  if (process.argv.length < 3) {
    y.showHelp();
    process.exit(0);
  }

  return y.argv;
};



