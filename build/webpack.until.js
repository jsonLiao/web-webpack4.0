const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const resolve = function (dir) {
  return path.resolve(__dirname, '..', dir);
}
const config = require('./webpack.config');

// 判断当前页面是否包含CommonCssChunk
function getCommonCssChunk(chunkName) {
  if (!config.commonCss) return []
  // 无commonCss.exclude，所有页面包含
  if (!config.commonCss.exclude) return 'common'
  //  有commonCss.exclude，不包含在该数组的页面引用
  if (config.commonCss.exclude && !config.commonCss.exclude.includes(chunkName)) return 'common'
  // 其他
  return []
}

let utils = {
  resolve,
  getFileList(targetPath) {
    let fileList = []
    const _getFileList = function (targetPath) {
      let dirFileList = fs.readdirSync(targetPath)
      return dirFileList.forEach(filename => {
        // 排除下划线开头的所有文件和文件夹
        if (/^_/.test(filename)) return
        let _path = path.resolve(targetPath, filename)
        if (fs.statSync(_path).isDirectory()) {
          _getFileList(_path)
        } else {
          fileList.push({
            filepath: _path,
            filename
          })
        }
      })
    }
    _getFileList(targetPath)
    return fileList
  },
  styleLoader: [
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        plugins: [
          autoprefixer({
            browsers: ['ie >= 8', 'Firefox >= 20', 'Safari >= 5', 'Android >= 4', 'Ios >= 6', 'last 4 version']
          }),
        ],
      }
    }
  ].concat(
    config.px2rem ? {
      loader: 'px2rem-loader',
      options: config.px2rem
    }: [], {
      loader: 'sass-loader',
      options: {
        data: `@import "src/css/global.scss";`
      }
    }
  ),
  getEntries(argv) {
    let entries = utils.getFileList(resolve('src/js'))
    let entry = {}
    let key
    entries.forEach((file) => {
      if (/.js$/.test(file.filename)) {
        key = file.filename.replace(/.js$/, '')
        entry[key] = file.filepath
      }
    })
    console.log('-------------【入口文件】------------------')
    console.log(entry)
    return entry
  },
  getHtmlWebpackPlugins(argv) {
    let targetPath = resolve('src/pages')
    let htmls = utils.getFileList(targetPath)
    let HtmlWebpackPlugins = []
    htmls.forEach((file) => {
      let chunkName
      let reg = /\.[^.]+$/
      if (reg.test(file.filename)) {
        chunkName = file.filename.replace(reg, '')
        HtmlWebpackPlugins.push(
          new HtmlWebpackPlugin({
            // html模板文件(在文件中写好title、meta等)
            template: file.filepath,
            // 输出的路径(包含文件名)
            filename: '.' + file.filepath.replace(targetPath, '').replace(reg, '.html'),
            // chunks主要用于多入口文件，当你有多个入口文件，那就回编译后生成多个打包后的文件，那么chunks 就能选择你要使用那些js文件
            chunks: [chunkName].concat(getCommonCssChunk(chunkName)).concat(argv.mode === 'production' ? ['vendor', 'commons', 'manifest'] : []),
            //自动插入js脚本
            //true body head false 默认为true:script标签位于html文件的 body 底部
            inject: true,
            // 压缩html
            minify: argv.mode !== 'production' ? undefined : {
              // 移除注释
              removeComments: true,
              // 不要留下任何空格
              collapseWhitespace: true,
              // 使用短的doctype替代doctype
              useShortDoctype: true,
              // 从style和link标签中删除type="text/css"
              removeStyleLinkTypeAttributes: true,
              // 移除空属性
              removeEmptyAttributes: true,
              // 缩小CSS样式元素和样式属性
              minifyCSS: true,
              // 脚本元素和事件属性中缩小JavaScript(使用UglifyJS)
              minifyJS: true
            },
          })
        )
      }
    })
    return HtmlWebpackPlugins
  }
}
module.exports = utils