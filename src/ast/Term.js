function Term(leftOperand, operator, rightOperand) {
  this.leftOperand = leftOperand;
  this.operator = operator;
  this.rightOperand = rightOperand;
};

Term.prototype.compile = function() {
  compiler.out(this.leftOperand, this.operator, this.rightOperand);
};
