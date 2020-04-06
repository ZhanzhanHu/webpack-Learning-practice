# webpack.config.js
学习使用webpack的demo配置的一个的config文件，从零开始搭建,基础配置、样式处理、支持es6、图片处理、打包多页、区分环境、懒加载、热更新等。
## 版本
webpack4.0

## 关于我理解的webpack
本质上是一种事件流机制，工作流就是将各插件串联在一起。
核心是tapable，原理是依赖于订阅发布模式，编译模块中有同步和异步的钩子

## 这是我用到的插件
	 @babel/core
	 @babel/preset-env
	 babel-loader
	 webpack-dev-server 
	 css-loader style-loader 
	 less less-loader
	 mini-css-extract-plugin
	 babel-runtime
	 @babel/plugin-proposal-class-properties
	 @babel/plugin-proposal-decorators//装饰器
	 @babel/plugin-transform-runtime
	 @babel/runtime 
	 file-loader /url-loader
	 html-withimg-loader
	 @babel/plugin-syntax-dynamic-import
	 
### package.json
	  "scripts": {
	    "build": "webpack",
	    "dev": "webpack-dev-server",
	  },
#### 补充  
多线程打包使用happypack插件，可节约大项目的打包时间  
webpack打包后的结果会省略并简化代码  
import 会删掉没用的代码 (tree-shaking)
