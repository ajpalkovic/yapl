function ReturnStatement(name) {
  this.name = name;
};

ReturnStatement.prototype.compile = function() {
  compiler.out('return ', this.name);
};
