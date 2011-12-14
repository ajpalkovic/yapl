function Method(isStatic, functionDeclaration) {
  this.isStatic = isStatic;
  this.functionDeclaration = functionDeclaration;
  this.classContext = undefined;
};

Method.prototype.compile = function() {
  var prototype = new MemberAccess(new MemberAccess(this.classContext.name, 'prototype'), this.functionDeclaration.name);
  var expressionForm = new FunctionExpression(undefined,
                                              this.functionDeclaration.parameters,
                                              this.functionDeclaration.functionBody);

  var method = new TerminatedStatement(
      new AssignmentExpression(prototype,
                               new AssignmentOperator('ASSIGN'),
                               expressionForm));

  compiler.out(method);
};

Method.prototype.isConstructor = function() {
  return this.classContext.name === this.functionDeclaration.name;
};
