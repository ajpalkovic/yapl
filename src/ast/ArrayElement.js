function ArrayElement(expression) {
  this.expression = expression;
};

ArrayElement.prototype.compile = function() {
  compiler.out(this.expression);
};
