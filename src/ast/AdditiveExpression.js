function AdditiveExpression(leftOperand, operator, rightOperand) {
  this.leftOperand = leftOperand;
  this.operator = operator;
  this.rightOperand = rightOperand;
};

AdditiveExpression.prototype.compile = function() {
  compiler.out(this.leftOperand, this.operator, this.rightOperand);
};
