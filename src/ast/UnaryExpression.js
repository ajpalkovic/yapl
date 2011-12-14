function UnaryExpression(operator, operand) {
  this.operator = operator;
  this.operand = operand;
};

UnaryExpression.prototype.compile = function() {
  compiler.out(this.operator, this.operand);
};
