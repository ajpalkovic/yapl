function Arguments(argumentList) {
  this.argumentList = argumentList;
};

Arguments.prototype.compile = function() {
  compiler.out('(', this.argumentList, ')');
};
