const path = require('path');
const ora = require('ora');
const download = require('download-git-repo');
const home = require('user-home');
const fs = require('fs-extra');
const builder = require('./Builder');

function isLocalPath(templatePath) {
  return /^[./]|(^[a-zA-Z]:)/.test(templatePath)
}

module.exports = (argv) => {
  const { template } = argv;
  if (isLocalPath(template)) {
    if (fs.pathExistsSync(template)) {
      new builder(template, argv);
    }
  } else {
    const localRepoPath = path.join(home, '.react-templates', template.replace(/\//g, '-'));
    const spinner = ora('downloading template');
    spinner.start();

    const repoRoot = path.resolve(__dirname, localRepoPath);
    fs.removeSync(repoRoot);

    download(template, localRepoPath, function (err) {
      spinner.stop();
      if (err) console.log(`Failed to download repo ${template} : ${err.message.trim()}`);
      new builder(localRepoPath, argv);
    });
  }
};
