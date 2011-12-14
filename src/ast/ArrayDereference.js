function ArrayDereference(expression) {
  this.expression = expression;
};

ArrayDereference.prototype.compile = function() {
  compiler.out('[', this.expression, ']');
};
