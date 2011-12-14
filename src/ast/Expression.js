function Expression(assignmentExpression) {
  this.assignmentExpression = assignmentExpression;
};

Expression.prototype.compile = function() {
  this.assignmentExpression.compile();
};
