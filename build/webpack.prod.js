const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const webpackCommon = require('./webpack.common');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const { styleLoader } = require('./webpack.until');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const config = require('./webpack.config');
module.exports = (env, argv) => {
  return merge(webpackCommon(env, argv), {
    mode: 'production',
    module: {
      rules: [{
        test: /\.(css|scss|sass)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../../'
            }
          },
          ...styleLoader,
        ],
      }]
    },
    plugins: [
      // 打包前先清除原有的打包文件
      new CleanWebpackPlugin(),

      // copy static文件夹到打包目录中
      new CopyWebpackPlugin([{
        from: path.resolve('./', config.build.assetsSubDirectory),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }]),

      // js压缩
      new UglifyJsPlugin({
        cache: false, // 缓存
        parallel: true,// 是否并发打包
        sourceMap: true, // 源码映射调试
        uglifyOptions: {
          ie8: true
        }
      }),

      // 打包css
      new MiniCssExtractPlugin({
        filename: `${config.build.assetsSubDirectory}/css/[name][hash:5].css`,
      }),

      // 
      

    ],
    optimization: {
      runtimeChunk: {
        name: 'manifest',
      },
      splitChunks: {
        minSize: 30000, // 超过20k才会被打包
        cacheGroups: {
          vendor: {
            name: "vendor",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            minChunks: 1
          },
          commons: {
            name: "commons",
            chunks: "all",
            minChunks: 2
          }
        }
      }
    }
  })
}
