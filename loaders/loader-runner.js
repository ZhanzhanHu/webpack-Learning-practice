//导出为函数的Js模块
const fs = require('fs')
const path = require('path')
const {runLoaders} = require('loader-runner')
runLoaders({
  resource:'../spriteImg.css',
  loaders: [path.resolve(__dirname,'./sprite-loader')],
  content:{
    minimize:true
  },
  readResource:fs.readFile.bind(fs) //读取资源函数
},(err,result)=>{ 
  err ? console.log(err) : console.log(result)
});
