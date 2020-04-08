------------------------------------------
        webpack4.x - 自动化构建打包 
------------------------------------------

一、安装

  cnpm i 或 npm i


二、启动

  npm start | npm run dev (启动本地服务)


三、打包
  
  npm run build 

四、分析依赖图

  npm run analyzer

五、目录

      |___  src                (开发目录)
            |___  images       (图片)
            |___  js           (js逻辑处理文件)
            |___  css          (sass文件)
            |___  pages/*.html (html文件)

      |___  build           (配置文件)
      |___  static          (静态资源)
      |___  package.json    (包管理文件)
      |___  .postcssrc.js   
      |___  babel.config.js
      |___  dist            (打包输出目录)


六、已实现功能

    ---css压缩
    ---css添加浏览器前缀
    ---js文件压缩
    ---js文件公共代码抽离压缩
    ---支持ES6语法
    ---支持SASS语法
    ---支持pug模版模块化
    ---本地环境打包
    ---线上环境打包
    ---本地开发热更新
    ---分析依赖图

