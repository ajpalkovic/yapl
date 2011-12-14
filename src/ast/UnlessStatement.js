function UnlessStatement(condition, body) {
  this.condition = condition;
  this.body = body;
};

UnlessStatement.prototype.compile = function() {
  var negated = new UnaryExpression(new Operator('!'), new ParenthesizedExpression(this.condition));
  compiler.out(new IfStatement(negated, this.body));
};
