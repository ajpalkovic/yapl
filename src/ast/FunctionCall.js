function FunctionCall(memberExpression, arguments) {
  this.memberExpression = memberExpression;
  this.arguments = arguments;
};
FunctionCall.prototype = new MemberExpression();

FunctionCall.prototype.compile = function() {
  MemberExpression.prototype.compile.call(this);
  compiler.out(this.arguments);
};

