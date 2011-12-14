function VariableDeclaration(name, value) {
  this.name = name;
  this.value = value;

  this.isInstanceVar = false;
  this.isStatic = false;
  this.visibility = undefined;
};

VariableDeclaration.prototype.compile = function() {
  compiler.currentScope.variables[this.name] = this;
  compiler.out(this.name, new Operator('='), this.value);
};
