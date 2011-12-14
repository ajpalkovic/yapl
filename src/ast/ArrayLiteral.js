function ArrayLiteral(elementList) {
  this.elementList = elementList;
};

ArrayLiteral.prototype.compile = function() {
  compiler.out('[', this.elementList, ']');
};
