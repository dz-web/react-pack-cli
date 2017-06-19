const start = require('../lib/download');
const path = require('path');
const fs = require('fs-extra');
const confirm = require('../lib/confirm');

exports.command = 'init <template> [path]';
exports.desc = 'init template';
exports.handler = function (argv) {
  argv.path = argv.path || '.';
  const pwd = process.cwd();
  argv.destPath = path.join(pwd, argv.path);
  let msg = '';
  if (pwd === argv.destPath) {
    msg = 'Create project under current directory?';
  } else if (fs.existsSync(argv.destPath)) {
    msg = 'Target directory exists. Continue?'
  }
  confirm(msg, msg === '').then(() => start(argv))
};
