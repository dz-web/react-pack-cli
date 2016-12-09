/**
 * Created by dz on 16/11/28.
 */
const chalk = require('chalk');
const express = require('express');
const rewriteModule = require('http-rewrite-middleware');
const app = express();

const webpackConfig = require('./webpack.config.js');
const config = require('../app.config');

let { port, host } = config.server;
port += 1;

app.use(rewriteModule.getMiddleware([
  { from: '(.*)\\.(.*)', to: '$1.$2' },
  { from: '.*', to: '/' },
], { silent: false }));

app.use(express.static(webpackConfig.output.path));

app.listen(port, host, function () {
  console.log(chalk.green(`Dist server listening on http://${host}:${port} ...`))
});