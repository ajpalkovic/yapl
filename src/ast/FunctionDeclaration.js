function FunctionDeclaration(name, parameters, functionBody) {
  this.name = name;
  this.parameters = parameters;
  this.functionBody = functionBody;
};

FunctionDeclaration.prototype.compile = function() {
  this.enter();
  this.doCompile();
  this.leave();
};

FunctionDeclaration.prototype.enter = function() {
  compiler.pushScope(this.name);
};

FunctionDeclaration.prototype.leave = function() {
  compiler.popScope();
};

FunctionDeclaration.prototype.doCompile = function() {
  console.log(this.functionBody);
  compiler.out('function', this.name ? ' ' : '', this.name, this.parameters, ' {');
  compiler.indent();

  if (this.parameters.varargs) {
    compiler.newline();
    compiler.out('var ', this.parameters.varargs.name, ' = Array.prototype.slice.call(arguments, 0);');
  }

  compiler.out(this.functionBody);
  compiler.undent();
  compiler.newline();
  compiler.out('}');
};
