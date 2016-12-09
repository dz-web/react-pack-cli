const config = {
  server: {
    host: 'localhost', // IP 地址
    port: 8000, // 端口号
  },
  copyFile: [
    // { from: './single_part', to: './' },
    // { from: './config.js', to: './config.js' },
  ],
  html: [
    {
      title: 'React App',
      links: [
        // './static/bootstrap_part.min.css',
      ],
      scripts: [
        // './config.js',
        // `./js/index.entry.js`,
        './static/polyfill.min.js',
      ],
    },
  ],
  entry: './src/index',
};

module.exports = config;