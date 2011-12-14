function BindExpression(unaryExpression) {
  this.unaryExpression = unaryExpression
};

BindExpression.prototype.compile = function() {
  this.enter();
  this.doCompile();
  this.leave();
};

BindExpression.prototype.enter = function() {
  compiler.flags.bind = true;
};

BindExpression.prototype.leave = function() {
  compiler.flags.bind = false;
};


BindExpression.prototype.doCompile = function() {
  compiler.out(this.unaryExpression);
};
