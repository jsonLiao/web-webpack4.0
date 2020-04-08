const path = require('path');
module.exports = {
  commonCss: {
    entry: path.resolve(__dirname, 'common.css.entry.js'), // String 必填，绝对地址
  },
  dev: {
    assetsPublicPath: '/', // 资源公共路径
    proxy: { // 代理
      "/index/1.html": {
        target: "http://localhost:8080",
        pathRewrite: {
          "/index/1.html": "/about.html"
        }
      },
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  build: {
    assetsPublicPath: './', // 也可是cdn地址
    assetsSubDirectory: 'static', // 打包后资源路径
    productionSourceMap: false, // 打包生成sourceMap
    bundleAnalyzerReport: process.env.npm_config_report,
  }
}