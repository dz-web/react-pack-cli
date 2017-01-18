// "use strict";
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('../app.config');
const server = require('../server');

const { port, host } = server;

const extractCSS = new ExtractTextPlugin({ filename: 'css/[name].css', allChunks: true });

module.exports = function ({ isRouter, isIE8, isPrd }) {

  // 根据配置生成 HtmlWebpackPlugin
  function createHtmlPlugins(cfg) {
    const templateParams = { template: path.resolve(__dirname, 'template/index.pug'), inject: false };
    if (isRouter && isPrd) templateParams.baseHref = `http://${host}:${port + 1}/`;
    // 生成多页面
    if (Array.isArray(cfg)) {
      return cfg.map(i => new HtmlWebpackPlugin(Object.assign({}, templateParams, i)))
    }
    // 单页面
    return [new HtmlWebpackPlugin(Object.assign({}, templateParams, cfg))];
  }

  // 生成开发模式的entry
  function createDevModeEntry(entrys) {
    const et = (index) => ['react-hot-loader/patch', index];

    // 单 entry 模式
    if (typeof entrys === 'string') {
      return et(entrys);
    }

    // 多 entry 模式
    const out = {};
    Object.keys(entrys).forEach(key => {
      out[key] = et(entrys[key]);
    });
    return out;
  }

  const commonConfig = {
    context: path.resolve(__dirname, '../'),
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    output: {
      path: path.resolve(__dirname, '../dist'), // 输出文件路径
      publicPath: isPrd ? '' : `http://${host}:${port}/`, // 防止css-loader不能正常加载图片
      filename: 'js/[name].entry.js', // 输出文件名
    },
    module: {
      rules: [
        { test: /\.pug/, loader: 'pug-loader?pretty' },
        { test: /\.css/, loaders: ['style-loader', 'css-loader'] },
        {
          test: /\.jsx?$/, // 通过正则匹配js,jsx文件
          loaders: ['babel-loader'], // 调用 babel进行es6->es5转换,并且启用react热替换
          exclude: /node_modules/, // 跳过 node_modules 目录
          include: path.resolve(__dirname, '../src'),
        },
        { test: /\.(jpg|gif|png|svg|ico)$/, loader: 'file-loader?name=images/[name].[ext]' },
      ]
    },
    plugins: createHtmlPlugins(config.html),
    devServer: {
      contentBase: path.resolve(__dirname, '../'),
      historyApiFallback: true,
      host,
      port,
      hot: true,
    },
  };

  const devConfig = {
    // devtool: 'source-map',
    devtool: 'eval',
    entry: createDevModeEntry(config.entry),
    module: {
      rules: commonConfig.module.rules.concat([
        {
          test: /\.scss$/,
          exclude: path.resolve(__dirname, '../src/css/'), // 跳过 node_modules 目录
          loaders: [
            'style-loader',
            'css-loader?modules&sourceMap=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
            'postcss-loader',
            'sass-loader?sourceMap',
          ],
        },
        {
          test: /\.scss$/,
          include: path.resolve(__dirname, '../src/css/'),
          loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader?sourceMap'],
        },
      ]),
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(), // 启用热替换插件
      new webpack.DefinePlugin({ 'DEBUG': true }),
    ],
  };

  const distConfig = {
    entry: config.entry,
    module: {
      rules: commonConfig.module.rules.concat([
        {
          test: /\.scss$/,
          exclude: path.resolve(__dirname, '../src/css'),
          loader: extractCSS.extract({
            loader: [
              'css-loader?minimize&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
              'postcss-loader',
              'sass-loader',
            ], publicPath: '../'
          }),
        },
        {
          test: /\.scss$/,
          include: path.resolve(__dirname, '../src/css'),
          loader: extractCSS.extract({
            loader: ['css-loader?minimize', 'postcss-loader', 'sass-loader'],
            publicPath: '../'
          }),
        },
      ])
    },
    plugins: [
      extractCSS,
      new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') }, 'DEBUG': false }),
      new CopyWebpackPlugin([
        { from: 'static/', to: 'static/' },
      ].concat(config.copyFile)),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        comments: false,
      }),
    ],
  };

  function merger(from, to) {
    const out = Object.assign({}, to);
    Object.keys(from).forEach((key) => {
      if (key in to) {
        if (Array.isArray(to[key])) { // 如果该是数组，则合并，比如 plugins
          out[key] = from[key].concat(to[key]);
        }
      } else {
        out[key] = from[key];
      }
    });
    return out;
  }

  const cfg = isPrd ? distConfig : devConfig;
  const finalResult = merger(commonConfig, cfg);

// 添加IE8兼容 es3ify-loader
  if (isIE8) {
    finalResult.module.rules.push(
      {
        test: /\.jsx?$/,
        loaders: ['es3ify-loader'],
        enforce: 'post',
      }
    );
  }

  return finalResult;
};
