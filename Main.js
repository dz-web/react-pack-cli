const path = require('path');
const os = require('os');
const spawn = require('cross-spawn');
const execPath = process.cwd();
const fs = require('fs-extra');
const inquirer = require('inquirer');
const klawSync = require('klaw-sync');
const chalk = require('chalk');
const minimatch = require('minimatch');
const ejs = require('ejs');
const ora = require('ora');
const { getGitUser } = require('./helper');
const argparser = require('./input');

const templateExt = '.ejs';
let destPath = (p = '') => path.resolve(execPath, p);
const appname = (p = execPath) => path.basename(p).toLocaleLowerCase().replace(' ', '_');

console.log('destPath', destPath());
const confirmPrompt = (msg, skip = false) => new Promise((resolve, reject) => {
  if (skip) {
    resolve();
    return;
  }
  inquirer.prompt({ type: 'confirm', name: 'isOk', message: msg, default: true }).then(
    (p) => {
      if (p.isOk) {
        resolve();
      } else {
        reject();
        process.exit(0);
      }
    });
});

inquirer.prompt(
  [
    {
      type: 'checkbox',
      name: 'mods',
      choices: [
        'redux',
        'react-router',
        'react-css-moudules',
        'testing',
      ]
    },
    {
      type: 'confirm',
      name: 'install',
      message: 'install?'
    },
  ]
).then(c => {
  console.log(c);
});

class Main {

  constructor(meta, templatePath) {
    this.meta = meta;
    this.templatePath = templatePath;
    this.delayCreatePath = false;
    this.props = Object.assign({}, argparser(this.meta.input), getGitUser(), { appName: appname() });

    // if have path params then create path
    if (this.props._.length > 0) {
      this.handlPathCreate();
    } else {
      this.prepareCreateApp();
    }
  }

  copy(from, to = from) {
    fs.copy(this.templatePath(from), destPath(to))
  };

  copyTpl(opts, from, to = from) {
    fs.readFile(this.templatePath(from), 'utf8', (err, data) => {
      if (err) throw err;
      const rs = ejs.render(data, opts, { filename: this.templatePath() });
      const destFile = destPath(to.replace(templateExt, ''));
      fs.ensureDirSync(path.dirname(destFile));
      fs.writeFileSync(destFile, rs, 'utf8');
    });
  };

  get info() {
    const keys = Object.keys(this.meta.input).filter(i => this.meta.input[i].hasOwnProperty('info'));
    const rs = keys.map(k => {
      const i = ` ${k} ${this.meta.input[k].info}`;
      return `\t${this.props[k] ? chalk.green('+' + i) : chalk.gray('-' + i) }\n`;
    }).join('');
    return ejs.render(this.meta.confirm, Object.assign({}, this.props, {
      path: destPath(),
      info: rs
    }));
  }

  writing() {
    const getTimeStamp = () => (new Date()).getTime();
    const startTime = getTimeStamp();

    try {
      const pendingCopyFiles = klawSync(this.templatePath(), { nodir: true });
      const skipList = {};
      this.meta.skip.forEach(i => skipList[i] = '');
      const fileFilter = Object.assign({}, skipList, this.meta.filter);
      const globs = Object.keys(fileFilter);

      // is path match globs
      const isPathMatch = p => {
        for (let g of globs) {
          if (minimatch(p, g, { dot: true })) {
            return (fileFilter[g]).split('|');
          }
        }
      };

      // copy file ,denpend on file extension
      const cp = p => p.endsWith(templateExt) ? this.copyTpl(this.props, p) : this.copy(p);

      // is file match module
      const isModuleMatch = (mods) => {
        for (let i of mods) {
          if (i in this.props && this.props[i]) {
            return true;
          }
        }
        return false;
      };

      for (let file of pendingCopyFiles) {
        const p = path.relative(this.templatePath(), file.path);
        const m = isPathMatch(p);
        if (m) {
          if (isModuleMatch(m)) cp(p);
        } else {
          cp(p)
        }
      }

      console.log(`${chalk.green('success')} All files created!`);
      console.log(`Done in ${getTimeStamp() - startTime} ms.`);
    } catch (e) {
      console.error(chalk.red('error ') + e.message);
    }
  }

  prepareCreateApp() {
    confirmPrompt(this.info, this.props.force).then(() => {
      if (this.delayCreatePath) fs.mkdirp(destPath());
      this.writing();
    })
  }

  handlPathCreate() {
    const createPath = this.props._[1];
    destPath = (p = '') => path.resolve(execPath, createPath, p);
    this.props.appName = this.props.appName || appname(path.resolve(execPath, createPath));
    console.log('this.props.name', this.props.appName);
    if (fs.existsSync(destPath())) {
      confirmPrompt(`"${destPath()}" already exists, overwrite?`, this.props.force).then(() => {
        this.prepareCreateApp();
      });
    } else {
      if (this.props.force) {
        fs.mkdirp(destPath());
      } else {
        this.delayCreatePath = true;
      }
      this.prepareCreateApp()
    }
  }

  install(dest) {
    try {
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

module.exports = Main;