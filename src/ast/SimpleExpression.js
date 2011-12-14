function SimpleExpression(leftOperand, operator, rightOperand) {
  this.leftOperand = leftOperand;
  this.operator = operator;
  this.rightOperand = rightOperand;  
};

SimpleExpression.prototype.compile = function() {
  compiler.out(this.leftOperand, this.operator, this.rightOperand);
};
