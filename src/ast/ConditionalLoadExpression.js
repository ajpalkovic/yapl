function ConditionalLoadExpression(unaryExpression) {
  this.unaryExpression = unaryExpression;
};

ConditionalLoadExpression.prototype.compile = function() {
  this.enter();
  this.doCompile();
  this.leave();
};

ConditionalLoadExpression.prototype.enter = function() {
  compiler.flags.conditionallyLoad = true;
};

ConditionalLoadExpression.prototype.leave = function() {
  compiler.flags.conditionallyLoad = false;
};


ConditionalLoadExpression.prototype.doCompile = function() {
  compiler.out(this.unaryExpression);
};
