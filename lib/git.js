const path = require('path');
const parser = require('iniparser');

module.exports = {
  gitUser() {
    try {
      const gitConfigPath = path.join(process.env.HOME || process.env.USERPROFILE, '.gitconfig');
      return parser.parseSync(gitConfigPath).user;
    } catch (e) {
      console.error(e);
      return { name: '', email: '' };
    }
  },
};
