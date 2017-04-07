const webpack = require('webpack');
const path = require('path');
const HtmlWebpackAssetPlugin = require('html-asset-webpack-plugin');
const helper = require('./helper');
const cfg = require('../app.config');
const { port, host } = cfg.server;

module.exports = {
  devtool: 'eval',
  context: path.resolve(__dirname, '../'),
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  entry: helper.createDevModeEntry(cfg.html),
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: `http://${host}:${port}/`,
    filename: '[name].js',
  },
  performance: {
    hints: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('development') },
      DEBUG: true,
    }),
    new webpack.LoaderOptionsPlugin({ debug: true, minimize: false }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
    ...helper.createHtmlPlugins(cfg.html),
    new HtmlWebpackAssetPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css/,
        loaders: ['style-loader', 'css-loader'],
      },
      {
        test: /\.jsx?$/, // 通过正则匹配js,jsx文件
        loader: 'babel-loader', // 调用 babel进行es6->es5转换,并且启用react热替换
        exclude: /node_modules/, // 跳过 node_modules 目录
        include: path.resolve(__dirname, '../src'),
        query: {
          cacheDirectory: true,
        },
      },
      { test: /\.(jpg|gif|png|svg|ico)$/, loader: 'file-loader?name=images/[name].[ext]' },
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
    ],
  },
};
