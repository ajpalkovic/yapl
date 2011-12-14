function InstanceVarDeclaration(isStatic, accessor, variableStatement) {
  this.isStatic = isStatic;
  this.accessor = accessor;
  this.variableStatement = variableStatement;
};

InstanceVarDeclaration.prototype.compile = function() {
  var variables = this.variableStatement.variableDeclarationList.elements;
  for (var i = 0, len = variables.length; i < len; ++i) {
    compiler.currentScope.variables[variables[i].name] = variables[i];
    variables[i].isStatic = this.isStatic;
  }
};
