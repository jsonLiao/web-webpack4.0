const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const {
  resolve,
  getEntries,
  getHtmlWebpackPlugins
} = require('./webpack.until');
const config = require('./webpack.config');
const analyArr = [];
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  analyArr.push(new BundleAnalyzerPlugin())
}
let otherEntries = {}
// 公共css文件入口
if (config.commonCss && config.commonCss.entry) {
  otherEntries.common = config.commonCss.entry
}
module.exports = (env, argv) => {
  return {
    entry: {
      ...otherEntries,
      ...getEntries(argv)
    },
    resolve: { //导入的时候不用写拓展名
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
      }
    },
    output: {
      path: resolve('dist'),
      filename: `${config.build.assetsSubDirectory}/js/[name].[hash:6].js`,
      publicPath: argv.mode === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    module: {
      rules: [{
          test: /\.html$/,
          use: [{
            loader: 'html-loader-srcset',
            options: {
              attrs: [':src']
            }
          }]
        },
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          include: resolve('src'),
          use: [{
            loader: 'babel-loader'
          }]
        },
        {
          test: /\.pug$/,
          use: [
            'html-loader',
            //'raw-loader', // webpack的加载器，允许将文件作为String导入。
            {
              loader: 'pug-html-loader',
              options: {
                data: {
                  mode: 9999
                }
              }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          include: /images/,
          options: {
            limit: 1000,
            name: "[name]-[hash:7].[ext]",
            outputPath: `${config.build.assetsSubDirectory}/images/`, //打包后图片文件输出路径
          }
        },
        {
          test: /\.(ttf|eot|svg|woff|woff2|otf)$/,
          use: [{
            loader: "url-loader",
            options: {
              name: "[name]-[hash:5].min.[ext]",
              limit: 1000, // fonts file size <= 1KB, use 'base64'; else, output svg file
              outputPath: `${config.build.assetsSubDirectory}/fonts/`, //打包后图片文件输出路径
            }
          }]
        },
      ]
    },
    plugins: [
      ...getHtmlWebpackPlugins(argv),
      new webpack.LoaderOptionsPlugin({
        options: {
          htmlLoader: {
            root: path.resolve('./', 'src')
          }
        }
      }),
      ...analyArr
    ],
  }
}