//用法background:url('b,png?__sprite)
const Spritesmith = require('spritesmith')
const fs = require('fs')
const path = require('path')
const loaderUtils = require("loader-utils")//获取参数
module.exports = function (source) {
  const options = loaderUtils.getOptions(this)
  const callback = this.async()
  const imgs = source.match(/url\((\S*)\?__sprite/g)
  const matchedImgs = []
  for (let i = 0; i < imgs.length; i++) {
    const img = imgs[i].match(/url\((\S*)\?__sprite/)[1]
    matchedImgs.push(path.join(__dirname, '../' + img))
  }

  Spritesmith.run({
    src: matchedImgs,
    algorithm: 'top-down',
    padding: 20
  }, (err, result) => {
    if (err) {
      console.log(err)
    }

    fs.writeFileSync(path.join(__dirname, '../entryFile/image/sprite.jpeg'), result.image)
    let coordinates = result.coordinates
    source = source.replace(/url\((\S*)\?__sprite\)/g, (match) => {

      let imgPath = path.join(__dirname, '../' + match.match(/url\((\S*)\?__sprite/)[1])
      return `url("./${options.folderName}/sprite.jpeg");background-position:${coordinates[imgPath].x} ${coordinates[imgPath].y}`

    })
  
    // fs.writeFileSync(path.join(__dirname, '../dist/sprite.css'), source)

    //  result.coordinates
    //   {
    //     '/Users/zhanzhan/Desktop/webpackLoaderAndPlugin/image/image1.jpeg': { x: 0, y: 0, width: 658, height: 424 },
    //     '/Users/zhanzhan/Desktop/webpackLoaderAndPlugin/image/image2.jpeg': { x: 0, y: 444, width: 658, height: 432 }
    //   }
    
      callback(null, source)
  
  })
}