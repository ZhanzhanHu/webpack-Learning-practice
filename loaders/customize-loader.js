module.exports = function(source) {
  source = source.split('')

  const EOF = Symbol('EOF')

  let currentToken = null
  let currentAttribute = null
  let currentText = null
  
  let stack = [{ type: 'document',children:[]}]
  function emit(token){
    let top = stack[stack.length - 1]
    if (token.type == 'startTag') {
      let element = {
        type:'element',
        children:[],
        attributes:[],
        tagName: token.tagName
      }
      for (let name in token){
        if(name != 'type' && name != 'tagName')
          element.attributes.push({
            name : name,
            value: token[name]
          })
      }
      top.children.push(element)

      if (!token.isSelfClosing){
        stack.push(element)
      }
      currentText = null
    } else if (token.type == 'endTag') {
      if (top.tagName != token.tagName){
        throw new Error('tag error')
      }else{
        stack.pop()
      }
      currentText = null
    } else if (token.type == 'text'){
      if (currentText == null){
        currentText = {
          type:'text',
          content: ''
        }
        top.children.push(currentText)
      }
      currentText.content += token.content
    }
  
  } 

  //词法分析(状态机)
  function data(c){
    if(c == '<'){
        return tagOpen
    } else if (c == EOF){
      emit({
        type: 'EOF',
      })
        return
    } else {
        emit({
          type:'text',
          content:c
        })
        return data
    }
  }


  function tagOpen(c) {
    if (c == '/') {
      return endTagOpen
    } else if (c.match(/^[a-zA-Z]$/)) {
      currentToken = {
        type:'startTag',
        tagName:''
      }
      return tagName(c)
    } else {
      emit({
        type: 'text',
        content: c
      })
      return
    }
  }

  function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)) {
      currentToken = {
        type: 'endTag',
        tagName: ''
      }
      return tagName(c) 
    } else if (c == '>'){

    } else if(c == EOF){

    }else{
      
    }
    
  }

  function tagName(c){
    if(c.match(/^[\t\n\f ]$/)){ 
      return beforeAttributeName
    } else if(c == '/'){
      return selfClosingStartTag
    } else if(c.match(/^[A-Z]$/)){
      currentToken.tagName +=  c   //c.toLowerCase() html不区分大小写
      return tagName
    }else if(c == '>'){
      emit(currentToken)
      return data
    } else {
      currentToken.tagName += c   //c.toLowerCase()
      return tagName
    }
  }

  function beforeAttributeName(c){
    if (c.match(/^[\t\n\f ]$/)) {
      return beforeAttributeName
    } else if (c == '/' || c == '>' || c == EOF ) {
      return afterAttributeName(c)
    } else if(c == '='){

    } else{
      currentAttribute = {
        name:'',
        value:''
      }
      return attributeName(c)
    }
  }

  function attributeName(c) {
    if (c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
      return afterAttributeName(c)
    } else if (c == '=') {
      return beforeAttributeValue
    } else if(c == '\u0000'){

    } else if(c == '\"' || c == "\'" || c == '<'){
       
    }else{
      currentAttribute.name += c 
      return attributeName
    }
  }

  function afterAttributeName(c){
    if (c.match(/^[\t\n\f ]$/)) {
      return afterAttributeName
    } else if (c == '/') {
      return selfClosingStartTag
    } else if(c == '='){
      return beforeAttributeValue
    } else if (c == '> ') {
      currentToken[currentAttribute.name] = currentAttribute.value
      emit(currentToken)
      return data
    } else if(c == EOF){

    } else {
      currentToken[currentAttribute.name] = currentAttribute.value
      currentAttribute = {
        name:'',
        value:''
      }
      return attributeName(c)
    }
  }

  function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
      return beforeAttributeValue;
    } else if (c == '\"') {
      return doubleQuotedAttributeValue
    } else if (c == '\'') {
      return singleQuotedAttributeValue
    }else if(c == '>'){
      //return data
    }else{
      return unQuotedAttributeValue(c)
    }
  }

  function doubleQuotedAttributeValue(c){
    if(c == '\"'){
      currentToken[currentAttribute.name] = currentAttribute.value
      return afterQuotedAttributeValue
    } else if(c == '\u0000'){

    } else if (c == EOF) {

    } else {
      currentAttribute.value += c 
      return doubleQuotedAttributeValue
    }
  }

  function singleQuotedAttributeValue(c){
    if (c == '\'') {
      currentToken[currentAttribute.name] = currentAttribute.value
      return afterQuotedAttributeValue
    } else if (c == '\u0000') {

    } else if (c == EOF) {

    } else {
      currentAttribute.value += c
      return singleQuotedAttributeValue
    }
  }

  function afterQuotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
      return beforeAttributeName
    } else if (c == '/') {
      return selfClosingStartTag 
    } else if (c == '>') {
      currentToken[currentAttribute.name] = currentAttribute.value
      emit(currentToken)
      return data
    } else if (c == EOF) {

    } else {
      currentAttribute.value += c
      return doubleQuotedAttributeValue
    }
  }

  function unQuotedAttributeValue(c){
    if (c.match(/^[\t\n\f ]$/)) {
      currentToken[currentAttribute.name] = currentAttribute.value
      return beforeAttributeName
    } else if (c == '/') {
      currentToken[currentAttribute.name] = currentAttribute.value
      return selfClosingStartTag
    } else if (c == '>') {
      currentToken[currentAttribute.name] = currentAttribute.value
      emit(currentToken)
      return data
    } else if (c == '\u0000') {

    } else if (c == EOF) {

    } else if (c == '\"' || c == '\'' || c == '=' || c == '<' || c ==' '){

    } else {
      currentAttribute.value += c
      return doubleQuotedAttributeValue
    }
  }

  function selfClosingStartTag(c){
    if(c == '>'){
      currentToken.isSelfClosing = true
      emit(currentToken)
      return data
    } else if(c == EOF){

    } else {
 
    }
  }

//执行阶段（将字符流通过状态机转token）

  let state = data

  for (let c of source){
     state = state(c)
  }
  state(EOF)
  let tree = stack[0]
  let template = tree.children.filter(el=> el.tagName == 'template')[0]
  console.log(template.children[1].children,'template')
//编译代码
  let rootElement = template.children.filter(el => el.type == 'element')[0]
  function compileCode(node){
    if(node.type == 'element'){
      //element = new ${ node.tagName }
        return (
        `
          element = document.createElement('${node.tagName}')
          ${
            node.attributes.map(attr => `element.setAttribute(${JSON.stringify[attr.name]},${JSON.stringify(attr.value)})\n`).join('')
          }

          if(stack.length > 0){
            stack[stack.length - 1].appendChild(element) 
          }
          stack.push(element)
          ${
            node.children ? node.children.map(child => compileCode(child)).join(''):""
          }
          root = stack.pop()
        `)
    }else if (node.type == 'text') {
      // new Text(${ JSON.stringify[node.content] })
      return (
        `
          element = document.createTextNode(${JSON.stringify(node.content)})
          if(stack.length > 0){
            stack[stack.length - 1].appendChild(element) 
          }
         
        `)
    }
  
  }
//  return
  // return `let stack = [],root = null \n let element;\n `+ compileCode(rootElement) + `export default root`
  return `
    let stack = [],root = null \n let element;\n `+ compileCode(rootElement) + `document.getElementById('app').appendChild(root)`
}