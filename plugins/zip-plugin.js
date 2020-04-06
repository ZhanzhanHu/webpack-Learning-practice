const JSZip = require('jszip')
const path = require('path')
const RawSource = require('webpack-sources').RawSource
const zip = new JSZip()

module.exports = class ZipPlugin{
  constructor(options){
    this.options = options
  }
  apply(compiler){
    compiler.hooks.emit.tapAsync('ZipPlugin', (compilation,callback) => {//异步tapAsync、同步tap
      const folder = zip.folder(this.options.filename)
      for (let filename in compilation.assets){
        let source = compilation.assets[filename].source()
        folder.file(filename,source)
      }
      zip.generateAsync({
        type:'nodebuffer'
      }).then(content=>{
        let outputPath = path.join(
          compilation.options.output.path,
          this.options.filename + '.zip'
        )
        let outputRelativePath = path.relative(
          compilation.options.output.path,
          outputPath)
        compilation.assets[outputRelativePath] = new RawSource(content)
        callback() 
      })
    })
  }
}