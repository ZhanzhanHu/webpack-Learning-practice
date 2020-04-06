# webpack.config.js
学习使用webpack的项目，除了常用的插件和配置之外，自己学习尝试写了一个插件和一个loader
## 版本
webpack4.0

## 这是我用到的loader和插件
    "@babel/core": "^7.9.0",
    "@babel/plugin-proposal-class-properties": "^7.8.3",
    "@babel/plugin-proposal-decorators": "^7.8.3",
    "@babel/plugin-syntax-dynamic-import": "^7.8.3",
    "@babel/plugin-transform-runtime": "^7.9.0",
    "@babel/preset-env": "^7.9.0",
    "@babel/runtime": "^7.9.2",
    "babel-loader": "^8.1.0",
    "clean-webpack-plugin": "^3.0.0",
    "css-loader": "^3.4.2",
    "file-loader": "^6.0.0",
    "html-loader": "^1.1.0",
    "html-webpack-plugin": "^4.0.4",
    "html-withimg-loader": "^0.1.16",
    "jszip": "^3.3.0",
    "less": "^3.11.1",
    "less-loader": "^5.0.0",
    "loader-utils": "^2.0.0",
    "mini-css-extract-plugin": "^0.9.0",
    "node-runner": "^1.0.2",
    "spritesmith": "^3.4.0",
    "style-loader": "^1.1.3",
    "url-loader": "^4.0.0",
    "webpack": "^4.42.1",
    "webpack-cli": "^3.3.11",
    "webpack-dev-server": "^3.10.3"，
    "extract-text-webpack-plugin": "^4.0.0-beta.0",
    "postcss-loader": "^3.0.0"

	 
### package.json
  "scripts": {
    "build": "webpack",
    "dev": "webpack-dev-server",
  }

### 雪碧图loader

### zip插件

## 关于我理解的webpack
本质上是一种事件流机制，工作流就是将各插件串联在一起。
核心是tapable，原理是依赖于订阅发布模式，编译模块中有同步和异步的钩子

