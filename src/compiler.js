function Compiler() {
  this.scopeChain = [];
  this.currentScope = undefined;
  this.indentLevel = [''];

  this.pushScope('<<GLOBAL>>');
  this.outputBuffer = [];
};

Compiler.prototype.compileTemplates = function() {
  for (var templateName in Templates) {
    var template = Templates[templateName];

    for (var i = 0; i < template.length; ++i) {
      var fnString = template[i] + '';
      Templates.templateFns[templateName][i] = this.interpolateTemplate(fnString);
    }
  }
};

Compiler.prototype.interpolateTemplate = function(templateFnString) {
  function balanceInterpolation(index) {
    for (var i = index; i < templateFnString.length; ++i) {
      switch (templateFnString[i]) {
        case '{':
          var end = balanceInterpolation(i + 1);
          i = end;
        case '}':
          return i;
      }
    }
  }

  var newTemplateFnString = '';
  var endOfLastInterpolation = 0;

  for (var i = 0; i < templateFnString.length; ++i) {
    if (templateFnString[i] === '\\') {
      i++;
      continue;
    }

    if (templateFnString[i] === '#' && templateFnString[i + 1] === '{') {
      var end = balanceInterpolation(i + 1);

      var before = templateFnString.substring(endOfLastInterpolation, i);
      var code = templateFnString.substring(i + 2, end);

      newTemplateFnString += before + "', " + code + ", '";

      endOfLastInterpolation = end + 1;
    }
  }

  newTemplateFnString += templateFnString.substring(endOfLastInterpolation);
  return eval('(' + newTemplateFnString + ')');
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

window.compiler = new Compiler();
