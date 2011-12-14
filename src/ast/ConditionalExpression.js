function ConditionalExpression(condition, trueExpression, falseExpression) {
  this.condition = condition;
  this.trueExpression = trueExpression;
  this.falseExpression = falseExpression;
};

ConditionalExpression.prototype.compile = function() {
  compiler.out(this.condition, ' ? ', this.trueExpression, ' : ', this.falseExpression);
};
