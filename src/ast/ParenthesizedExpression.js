function ParenthesizedExpression(expressionList) {
  this.expressionList = expressionList;
};

ParenthesizedExpression.prototype.compile = function() {
  compiler.out('(', this.expressionList, ')');
};
