#!/usr/bin/env node

const path = require('path');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const inquirer = require('inquirer');
const ncp = require('ncp').ncp;
const ofs = require('fs');
const os = require('os');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const helper = require('./helper');
const execPath = process.cwd();
const appname = path.basename(execPath).toLocaleLowerCase().replace(' ', '_');

const pack = require('./template/package.json');
const babelrc = require('./template/babelrc');

const store = memFs.create();
const fs = editor.create(store);

const templatePath = (p = '') => path.resolve(__dirname, './template', p);
let destPath = (p = '') => path.resolve(execPath, p);

class Main {

  constructor() {
    this.props = {};
    const u = helper.getGitUser();
    this.user = { userName: u.name || '', email: u.email || '' };
    const p = fs.readJSON(path.join(__dirname, 'package.json'));
    this.welcome = `Welcome to use React/Webpack generator v${p.version}`;

    if (process.argv.length < 3) {
      this.initUserInput();
    } else {
      this.initArgsv();
    }
  }

  initArgsv() {
    const opt = {
      'e': {
        alias: 'ie8',
        describe: 'Support IE8+ browser',
      },
      'x': {
        alias: 'redux',
        describe: 'Use redux',
      },
      'o': {
        alias: 'router',
        describe: 'Use react-router',
      },
      'c': {
        alias: 'cssm',
        describe: 'Use react css moudules',
      },
      'n': {
        alias: 'name',
        describe: 'Project name',
      },
      't': {
        alias: 'testing',
        describe: 'Is need testing',
      },
      'y': {
        describe: 'Force to confirm',
      },
      'i': {
        alias: 'install',
        describe: 'Install all dependencies',
      },
      'v': {
        describe: 'Show verbose log',
      },
    };

    this.argv = require('yargs')
      .usage(`${this.welcome}\n\nUsage: re|react [path] [options]`)
      .options(opt)
      .locale('en')
      .help('h')
      .argv;

    if (this.argv._.length > 0) {
      this.handlPathCreate();
    } else {
      this.showAppInfo();
    }
  }

  handlPathCreate() {
    destPath = (p = '') => path.resolve(execPath, this.argv._[0], p);
    try {
      ofs.accessSync(destPath()); // 是否能访问目的路径

      if (this.argv.y) {
        this.showAppInfo();
        return;
      }

      inquirer.prompt({
        type: 'confirm',
        name: 'isOk',
        message: `"${destPath()}" already exists, overwrite?`,
        default: true
      }).then((p) => {
        if (p.isOk) {
          // 如果确定覆盖,继续创建
          this.showAppInfo();
        } else {
          // 否则 退出
          console.log('abort!');
          process.exit(0);
        }
      });
    } catch (e) {
      // 不存在当前路径，则创建
      ofs.mkdirSync(destPath());
      this.showAppInfo();
    }
  }

  showAppInfo() {
    const { name = appname, ie8 = false, redux = false, router = false, cssm = false, testing = false, y = false } = this.argv;
    this.props = { name, ie8, redux, cssm, router, testing };

    const s = (v, msg) => v ? `    ${chalk.green('+ ' + msg)}` : `    ${chalk.gray('- ' + msg)}`;
    const str = `Please confirm your App's info.\n---------------------------------\n  App Name : ${chalk.green(name)} \n  Path : ${chalk.green(destPath())}\n  Modules  : \n${s(ie8, 'e  IE8+')} \n${s(redux, 'x  Redux')} \n${s(router, 'o  Router')} \n${s(cssm, 'c  CSS modules')} \n${s(testing, 't  Testing')}\n---------------------------------\n`;

    if (y) {
      this.writing();
      return;
    }

    inquirer.prompt({
      type: 'confirm',
      name: 'isOk',
      message: `${str}Yes / no?`,
      default: true
    }).then((props) => {
      if (props.isOk) this.writing();
    });
  }

  initUserInput() {
    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Project name',
        default: appname
      },
      {
        type: 'confirm',
        name: 'ie8',
        message: 'Support IE8+ browser?',
        default: false
      },
      {
        type: 'checkbox',
        name: 'tools',
        message: 'Choose other librarys',
        choices: [
          { name: 'Redux', value: 'redux' },
          { name: 'React router', value: 'router' },
          { name: 'CSS modules', value: 'cssm' },
        ]
      },
      {
        type: 'confirm',
        name: 'testing',
        message: 'Is need unit testing ?',
        default: false
      }
    ];

    console.log(this.welcome);
    inquirer.prompt(prompts).then((props) => {
      this.initProps(props);
      // console.log(this.props);
      this.writing();
    });
  }

  initProps(p) {
    const redux = p.tools.includes('redux');
    const cssm = p.tools.includes('cssm');
    const router = p.tools.includes('router');
    this.props = Object.assign({}, p, { redux, cssm, router });
  }

  copy(a, b = a) {
    fs.copy(templatePath(a), destPath(b));
  }

  copyTpl(o, a, b = a) {
    fs.copyTpl(templatePath(a), destPath(b), o);
  }

  copyReactSource() {
    this.copy('src/css');
    const { cssm, redux, router } = this.props;

    if (redux) {
      this.copy('src/model/action.js');
      this.copy('src/model/action-types.js');
      this.copyTpl(this.props, 'src/model/reducer.js.ejs', 'src/model/reducer.js');
    }

    this.copyTpl(this.props, 'src/views/about.jsx.ejs', 'src/views/about.jsx');
    this.copyTpl(this.props, 'src/views/user.jsx.ejs', 'src/views/user.jsx');

    if (cssm) {
      this.copy('src/views/about.scss');
      this.copy('src/views/user.scss');
    }

    if (router && redux) {
      this.copy('src/app-router-redux.jsx', 'src/app.jsx');
      this.copyTpl(this.props, 'src/wrap-router-redux.jsx.ejs', 'src/wrap.jsx');
    } else if (router) {
      this.copy('src/app-router.jsx', 'src/app.jsx');
      this.copy('src/wrap-router.jsx', 'src/wrap.jsx');
    } else if (redux) {
      this.copy('src/app-redux.jsx', 'src/app.jsx');
      this.copy('src/wrap-redux.jsx', 'src/wrap.jsx');
    } else {
      this.copy('src/app.jsx');
    }

    // this.copy index.jsx
    if (redux || router) {
      this.copy('src/index-wrap.jsx', 'src/index.jsx');
    } else {
      this.copy('src/index.jsx');
    }
  }

  copyTesting() {
    if (this.props.testing) {
      ncp(templatePath('./testing'), destPath(), function (err) {
        if (err) return console.error(err);
      });
    }
  }

  writing() {
    const d = (new Date()).getTime();
    try {
      // 复制静态文件
      ncp(templatePath('./asset'), destPath(), function (err) {
        if (err) return console.error(err);
      });

      // 写入 package.json
      fs.write(destPath('package.json'), pack.getPackageJSON(Object.assign({}, this.props, this.user)));
      // 写入 gitignore
      this.copy('_.gitignore', '.gitignore');
      // console.log(this.props);
      this.copyTpl(this.props, 'webpack.config.js.ejs', 'dev/webpack.config.js');
      // 写入 babelrc
      fs.writeJSON(destPath('.babelrc'), babelrc(this.props), null, '  ');
      // 复制 React 代码文件
      this.copyReactSource();

      this.copyTesting();

      fs.commit(() => { });

      console.log(chalk.green('success ') + 'All files created!');
      console.log(`Done in ${(new Date()).getTime() - d} ms.`);

      this.install();

    } catch (e) {
      console.error(chalk.red('error ') + e.message);
    }
  }

  install() {
    const { i = false } = this.argv;
    if (i) {
      const dest = destPath();
      spawn('yarn', ['install'], { stdio: 'inherit', cwd: dest })
        .on('error', function (err) { throw err; })
        .on('close', function () { });
    }
  }

}

new Main();


