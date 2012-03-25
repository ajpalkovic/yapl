function Compiler() {
  this.scopeChain = [];
  this.currentScope = undefined;
  this.indentLevel = [''];

  this.pushScope('<<GLOBAL>>');
  this.outputBuffer = [];
};

Compiler.prototype.pushScope = function(name) {
  this.currentScope = {
    name: name,
    classes: {},
    functions: {},
    variables: {}
  };

  this.scopeChain.push(this.currentScope);
};

Compiler.prototype.popScope = function() {
  if (this.scopeChain.length === 1) {
    return;
  }

  this.scopeChain.pop();
  this.currerntScope = this.scopeChain[this.scopeChain.length - 1];
};

Compiler.prototype.findSymbol = function(name) {
  var symbol = undefined;
  for (var i = this.scopeChain.length - 1; i >= 0; --i) {
    symbol = this.scopeChain[i].symbols[name];
    if (symbol) break;
  }

  return symbol;
};

Compiler.prototype.out = function(varargs) {
  for (var i = 0, len = arguments.length; i < len; ++i) {
    if (!arguments[i]) continue;

    switch (typeof arguments[i]) {
      case 'string':
        this.outputBuffer.push(arguments[i]);
        break;
      case 'function':
        arguments[i]();
        break;
      default:
        if (arguments[i] instanceof Array) {
          this.out.apply(this, arguments[i]);
        } else {
          arguments[i].compile();
        }
    }
  }
};

Compiler.prototype.compileTempalte = function(template) {
  var string = template + '';
  var compiledStr = this.interpolate(string);
};

Compiler.prototype.interpolate = function(string) {
  var output = [];
  var startingSym = false;
  var start = 0, end = 0;
  
  for (var i = 0, len = string.length; i < len; ++i) {
    if (string[i] === '\\')
  }
  
  return output.join('');
};

Compiler.prototype.flushOut = function() {
  var str = this.outputBuffer.join('');
  this.outputBuffer = [];
  return str;
};

Compiler.prototype.newline = function() {
  this.outputBuffer.push('\n', this.indentLevel[this.indentLevel.length - 1]);
};

Compiler.prototype.indent = function() {
  this.indentLevel.push(this.indentLevel[this.indentLevel.length - 1] + '  ');
};

Compiler.prototype.undent = function() {
  this.indentLevel.pop();
};

compiler = new Compiler();
