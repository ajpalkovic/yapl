function MemberExpression() {};

MemberExpression.prototype.compile = function() {
  compiler.out(this.memberExpression);
};
