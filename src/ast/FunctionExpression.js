function FunctionExpression(name, parameters, functionBody) {
  this.name = name;
  this.parameters = parameters;
  this.functionBody = functionBody;
};

FunctionExpression.prototype.compile = function() {
  compiler.out(new FunctionDeclaration(this.name, this.parameters, this.functionBody));
};
