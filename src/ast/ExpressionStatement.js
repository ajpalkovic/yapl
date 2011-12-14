function ExpressionStatement(expression) {
  this.expression = expression;
};

ExpressionStatement.prototype.compile = function() {
  this.expression.compile();
};
