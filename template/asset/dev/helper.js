const HTMLWebpackPlugin = require('html-webpack-plugin');

function createCommonEntry(cfg) {
  if (Array.isArray(cfg)) {
    const obj = {};
    cfg.forEach(i => (obj[i.name] = i.entry));
    return obj;
  }
  return { [cfg.name]: cfg.entry };
}

const et = (index) => [
  'react-hot-loader/patch',
  'webpack-dev-server/client',
  'webpack/hot/only-dev-server',
  'react-hot-loader',
  index,
];

// 生成开发模式的entry
function createDevModeEntry(cfg) {
  const entrys = createCommonEntry(cfg);

  // 单 entry 模式
  // if (typeof entrys === 'string') return et(entrys);

  // 多 entry 模式
  const out = {};
  Object.keys(entrys).forEach(key => (out[key] = et(entrys[key])));
  return out;
}

// 生成默认html webpack参数
function defaultParams(cfg) {
  if (!Object.hasOwnProperty.call(cfg, 'name')) {
    throw new Error(`name is empty! ${JSON.stringify(cfg, null, '\t')}`);
  }

  return {
    template: './public/index.html',
    filename: `${cfg.name}.html`,
    chunks: [cfg.name, 'vendor'],
    inject: true,
  };
}

// 根据配置生成 HtmlWebpackPlugin
function createHtmlPlugins(cfg) {
  // 生成多页面
  if (Array.isArray(cfg)) {
    return cfg.map(i => new HTMLWebpackPlugin(Object.assign({}, defaultParams(i), i)));
  }
  // 单页面
  return [new HTMLWebpackPlugin(Object.assign({}, defaultParams(cfg), cfg))];
}

module.exports = {
  createCommonEntry,
  createDevModeEntry,
  createHtmlPlugins,
};