const path = require('path');
const os = require('os');
const spawn = require('cross-spawn');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const klawSync = require('klaw-sync');
const chalk = require('chalk');
const minimatch = require('minimatch');
const ejs = require('ejs');
const ora = require('ora');
const confirm = require('./confirm');
const { gitUser } = require('./git');

const templateExt = '.ejs';

class Builder {

  constructor(repoPath, argv) {
    this.templatePath = (p = '') => path.join(repoPath, 'template', p);
    this.destPath = (p = '') => path.join(argv.destPath, p);
    this.meta = require(path.join(repoPath, 'bootstrap.js'));
    this.argv = argv;
    this.filter = this.getFilter();

    inquirer.prompt(this.meta.prompt).then(p => {
      this.props = Object.assign({}, p, gitUser(), { appName: argv.path });
      fs.ensureDir(argv.path);
      this.writing();
      confirm('Install all dependence right now?').then(() => this.install());
    });
  }

  copy(from, to = from) {
    fs.copy(this.templatePath(from), this.destPath(to), err => {
      if (err) return console.error(err)
    })
  };

  copyTpl(opts, from, to = from) {
    fs.readFile(this.templatePath(from), 'utf8', (err, data) => {
      if (err) throw err;
      const rs = ejs.render(data, opts, { filename: this.templatePath() });
      const destFile = this.destPath(to.replace(templateExt, ''));
      fs.ensureDirSync(path.dirname(destFile));
      fs.writeFileSync(destFile, rs, 'utf8');
    });
  };

  // copy file ,denpend on file extension
  copyFile(filePath) {
    filePath.endsWith(templateExt) ? this.copyTpl(this.props, filePath) : this.copy(filePath);
  }

  getFilter() {
    const ignoreList = {};
    this.meta.ignore.forEach(i => ignoreList[i] = '');
    return Object.assign({}, ignoreList, this.meta.filter);
  }

  writing() {
    try {
      const globs = Object.keys(this.filter);

      const isPathMatch = p => {
        for (let g of globs) {
          if (minimatch(p, g, { dot: true })) {
            return this.filter[g].split('|');
          }
        }
      };

      // is file match module
      const isMatchOneModule = (mods) => {
        for (let i of mods) {
          // if props have this module and the value is true
          if (this.props[i]) {
            return true;
          }
        }
        return false;
      };

      const pendingCopyFiles = klawSync(this.templatePath(), { nodir: true });
      for (let file of pendingCopyFiles) {
        const relativeFilePath = path.relative(this.templatePath(), file.path);
        const m = isPathMatch(relativeFilePath);
        // console.log(m, file.path);
        if (m) {
          isMatchOneModule(m) && this.copyFile(relativeFilePath);
        } else {
          this.copyFile(relativeFilePath)
        }
      }

      console.log(`${chalk.green('success')} All files created!`);
    } catch (e) {
      console.error(chalk.red('error ') + e.message);
    }
  }

  install() {
    try {
      const dest = this.argv.destPath;
      // yarn install
      spawn('yarn', ['install'], { stdio: 'inherit', cwd: dest }).on('close', code => {
        // npm run start
        if (code !== 0) return;
        console.log('Run npm start script, waiting ...');
        spawn('npm', ['start'], { stdio: 'inherit', cwd: dest })
      });
    } catch (e) {
      console.error(chalk.red('error ') + e.message);
    }
  }

}

module.exports = Builder;
