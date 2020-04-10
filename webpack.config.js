const path = require('path')
var ZipPlugin = require('./plugins/zip-plugin.js')
var HtmlWebpackPlugin = require('html-webpack-plugin');//自动讲编译好的js插入相应html的插件
var {CleanWebpackPlugin} = require('clean-webpack-plugin')//自动清除上一次打包文件
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var extractCSS = new ExtractTextPlugin('[name].css');
// var extractLESS = new ExtractTextPlugin('[name].less');
var webpack = require('webpack') //内置插件
module.exports = {
  mode: 'development',
  entry:{
    index:'./entryFile/index.js',
    customize:'./entryFile/index.customize'
  },
  output:{
    filename: "js/[name].js",
    path: path.resolve(__dirname, 'dist'),
    //chunkFilename:'[name].js'// 设置按需加载后的chunk名字  import('./b').then(function(module){})
    //publicPath:'dist/'  // 设置基础路径
  },
  optimization: {
    splitChunks: {//分割代码块
      cacheGroups: {//缓存组
        common: {//公共模块
          chunks: 'initial',
          minSize: 1,//大小
          minChunks: 2//用过一次以上就抽离
        },
        vendor: {
          priority: 1,//权重,会先抽离第三方文件
          test: /node_modules/,//把这个文件抽离出来
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        }
      }
    }
  },
  watch: true,//实时打包
  watchOptions: {//监控选项
    poll: 1000,//每秒问我1000次
    aggregateTimeout: 500,//防抖，500ms内所做的任何其他更改聚合到一个重建中。
    ignored: /node_modules/
  },
  devServer: {
    hot: true,//启用热更新
    port: 3000,
    open: true,
    contentBase: './dist'
  },
  resolve: {
    extensions: ['.js', '.html', 'css'] //当没有输入文件后缀时会寻找文件数组中的文件后缀
  },
  module:{
    noParse: /jquery/,//不去解析jq依赖库
    rules:[
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options:{
            minimize: false,
            // attrs: ['img:src', 'link:href']  //开启link的替换
          }
        }]
      },
      {
        test: /\.(js|jsx)$/,
        use:[
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ],
              plugins: [
                ["@babel/plugin-proposal-decorators", { "legacy": true }],//装饰器
                ["@babel/plugin-proposal-class-properties", { "loose": true }],//转换es6的class
                ["@babel/plugin-syntax-dynamic-import"]//懒加载  在js中引入加载文件 import(../source.js ).then(data=>{})  vue的路由懒加载原理同理
              ],
            },
          }
        ]
      },
      {
        test: /\.css$/,
        // use: [
        //     {
        //       loader:"style-loader",//插入到head标签中
        //       options:{
        //           insertAt:"top"
        //       }
        //     }, 
        // ],
        loader: extractCSS.extract({
          fallback: "style-loader",
          use: [
                'css-loader', 
                { loader: path.resolve('./loaders/sprite-loader.js'),
                  options: {
                    folderName: "image"
                  }
                }
               ]
        })
      },
      {
        test: /\.less$/,//处理less文件
        use: [
          {
              loader: "style-loader",
              options: {
                  insertAt: "top"
              }
          },
          // extractLESS.extract(['css-loader',path.resolve('./loaders/sprite-loader.js'), 'less-loader']),
        ]
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,  //是把小于100k的文件打成Base64的格式，写入JS 1024b = 1k
              name: 'image/[name].[ext]',//图片在dist文件中的位置
              //publicPath: "../image",//访问图片路径
            }
          }
        ]
      },
      {
        test: /\.customize$/,
        use: [
          {
            loader: require.resolve('./loaders/customize-loader.js'),
          }
        ]
      }
    ]
  },
  plugins:[
    new ZipPlugin({
      filename:'offline'
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),//忽略打包引入插件，可手动在文件中添加、减少文件体积
    new webpack.NamedModulesPlugin(),//打印更新的模块路径
    new webpack.HotModuleReplacementPlugin(),//支持热更新插件
    new HtmlWebpackPlugin({//自动将编译好的js插入相应html的插件
      filename: 'customize.html',
      template: "./entryFile/index.html",
      hash: true,
      chunks: ['customize']
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './entryFile/index.html',
      hash: true,
      chunks: ['index'],
      // minify: {
      //   removeAttributeQuotes: true,
      //   removeComments: true,
      //   collapseWhitespace: true,
      //   removeScriptTypeAttributes: true,
      //   removeStyleLinkTypeAttributes: true
      // }
    }),
    new CleanWebpackPlugin(),//清除webpack重复打包插件
    extractCSS,
    // extractLESS,
  ]
}