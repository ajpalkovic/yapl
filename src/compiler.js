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

    if (arguments[i] instanceof String || typeof arguments[i] === 'string') {
      this.outputBuffer.push(arguments[i]);
    } else if (typeof arguments[i] === 'function') {
      arguments[i]();
    } else {
      arguments[i].compile();
    }
  }
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
