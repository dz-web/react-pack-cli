/**
 * Created by dz on 16/12/9.
 */
const path = require('path');
const parser = require('iniparser');

module.exports = {

  getGitUser() {
    const gitConfigPath = path.join(process.env.HOME || process.env.USERPROFILE, '.gitconfig');

    let rs = {};
    try {
      rs = parser.parseSync(gitConfigPath).user;
    } catch (err) {
      console.error(err);
    }
    return rs;
  }

};
