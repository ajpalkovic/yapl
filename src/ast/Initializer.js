function Initializer(assignmentExpression) {
  this.assignmentExpression = assignmentExpression;
};

Initializer.prototype.compile = function() {
  compiler.out(' = ', this.assignmentExpression);
};

