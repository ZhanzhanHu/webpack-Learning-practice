const path = require('path')
const OPTIONS = {
  entry: path.join(__dirname, 'xxxx'),
  output: {
    path: path.join(__dirname, 'xxxx'),
    fileName: 'main.js'
  }
}

//解析AST,分析依赖
const fs = require('fs')
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const { transformFromAst } = require('babel-core')
const PARSE = {
  getAST: (path) => {//生成AST
    const content = fs.readFileSync(path, 'utf-8')
    return babylon.parse(content, {
      sourceType: 'module'
    })
  },
  getDependencies: (ast) => {//分析依赖
    const dependencies = []
    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        dependencies.push(node.source.value)
      }
    })
    return dependencies
  },
  transform: (ast) => {//es6 => es5
    const { code } = transformFromAst(ast, null, {
      presets: ['env']//需要安装babel-preset-env
    })
    return code
  }

}

//执行模块的构建和模块的输出
class Complier {
  constructor(options) {
    const { entry, output } = options
    this.entry = entry
    this.output = output
    this.modules = []//所有构建好数据
  }
  run() {
    const entryModule = this.buildModule(this.entry, true)
    this.modules.push(entryModule)
    this.modules.map((_module) => {
      _module.dependencies.map((dependency) => {
        this.modules.push(this.buildModule(dependency))
      })
    })
    this.emitDFiles()
  }
  buildModule(fileName, isEntry) {//分析依赖，对每个依赖模块进行Build
    let ast;
    if (isEntry) {
      ast = PARSE.getAST(fileName)
    } else {
      const absolutePath = path.join(process.cwd(), './src', fileName)
      ast = PARSE.getAST(absolutePath)
    }
    return {
      fileName,
      dependencies: PARSE.dependencies(ast),
      source: PARSE.transform(ast)
    }
  }
  emitDFiles() {
    const outputPath = path.join(this.output.path, this, output.fileName)
    let modules = ''
    this.modules.map((_module) => {
      modules += `'${_module.fileName}':function(require,module,exports){${_module.source}},`
    })
    const bundle = `(function(modules ){
            function require(filename){
                var fn = modules[filename] 
                var module = {exports:{} } 

                fn(require,module,module.exports)
                return module.exports;
            }
            require('${this.entry}')
        })({${modules}})`
    fs.writeFileSync(outputPath, bundle, 'utf-8')
  }
}

//入口文件
const complier = new Complier(OPTIONS)
complier.run()