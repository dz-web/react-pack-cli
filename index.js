#!/usr/bin/env node

const yargs = require('yargs').usage('Usage: $0 <command> [options')
  .commandDir('cmds')
  .demandCommand()
  .locale('en')
  .help('h')
  .argv;
