function NewExpression(leftHandSideExpression) {
  this.leftHandSideExpression = leftHandSideExpression;
};

NewExpression.prototype.compile = function() {
  compiler.out('new ', this.leftHandSideExpression);
};
