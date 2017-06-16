const path = require('path');
const parser = require('iniparser');
// const chalk = require('chalk');

module.exports = {
  getGitUser() {
    try {
      const gitConfigPath = path.join(process.env.HOME || process.env.USERPROFILE, '.gitconfig');
      return parser.parseSync(gitConfigPath).user;
    } catch (e) {
      console.error(e);
      return '';
    }
  },
}

