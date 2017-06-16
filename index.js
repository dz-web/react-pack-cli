#!/usr/bin/env node

// const path = require('path');
// const ora = require('ora');
// const download = require('download-git-repo');
// const home = require('user-home');
// const Main = require('./Main');
// const argparser = require('./input');
//
// const template = argparser()._[0];
// const localRepoPath = path.join(home, '.react-templates', template.replace(/\//g, '-'));

// const spinner = ora('downloading template');
// spinner.start();

// download(template, localRepoPath, function (err) {
//   spinner.stop();

// if (err) console.log(`Failed to download repo ${template} : ${err.message.trim()}`);
// const repoRoot = (p = '') => path.resolve(__dirname, localRepoPath, p);
// const templatePath = (p = '') => path.resolve(__dirname, localRepoPath, 'template', p);
// console.log(templatePath());
// const meta = require(repoRoot('meta.js'));
// new Main(meta, templatePath);
// });

const inquirer = require('inquirer');
inquirer.prompt(
  [
    {
      type: 'confirm',
      name: 'redux',
      message: 'Use redux?'
    },
    {
      type: 'confirm',
      name: 'router',
      message: 'Use react router?'
    },
    {
      type: 'confirm',
      name: 'cssm',
      message: 'Use react css moudules?'
    },
     {
      type: 'confirm',
      name: 'testing',
      message: 'Is need be testing?'
    },
    {
      type: 'confirm',
      name: 'install',
      message: 'Install all dependence right now?'
    },
  ]
).then(c => {
  console.log(c);
});

