const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { styleLoader } = require('./webpack.until');
const webpackCommon = require('./webpack.common');
const config = require('./webpack.config');
module.exports = (env, argv) => {
  return merge(webpackCommon(env, argv), {
    mode: 'development',
    devtool: 'dev-source-map',
    module: {
      rules: [{
        test: /\.(css|scss|sass)$/,
        use: [
          'style-loader',
          ...styleLoader
        ]
      }]
    },
    plugins:[
      new webpack.HotModuleReplacementPlugin(), // 启用 热更新
    ],
    devServer: {
      host: '127.0.0.1',
      port: 8080, // 端口号
      open: true,
      // hot: true,
      // hotOnly: true,
      overlay: true, // 浏览器页面上显示错误
      // stats: "errors-only", //stats: "errors-only"表示只打印错误：
      proxy: config.dev.proxy
    }
  })  
};