function VariableStatement(variableDeclarationList) {
  this.variableDeclarationList = variableDeclarationList;
};

VariableStatement.prototype.compile = function() {
  compiler.out('var ', this.variableDeclarationList);
};
