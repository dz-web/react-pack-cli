const inquirer = require('inquirer');

module.exports = (msg, skip = false) => new Promise((resolve) => {
  if (skip) return resolve();
  inquirer.prompt({ type: 'confirm', name: 'ok', message: msg, default: true }).then(p => {
    p.ok && resolve();
  });
});