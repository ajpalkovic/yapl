function BlockBody(statementList) {
  this.statementList = statementList;
};

BlockBody.prototype.enter = function() {
  compiler.pushScope();
};

BlockBody.prototype.leave = function() {
  compiler.popScope();
};

BlockBody.prototype.compile = function() {
  this.enter();
  this.doCompile();
  this.leave();
};


BlockBody.prototype.doCompile = function() {
  compiler.out('{');
  compiler.indent();
  compiler.out(this.statementList);
  compiler.undent();
  compiler.newline();
  compiler.out('}');
};
