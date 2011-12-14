function PostfixIfStatement(condition, statement) {
  this.condition = condition;
  this.statement = statement;
};

PostfixIfStatement.prototype.compile = function() {
  compiler.out('if (', this.condition, ') ', this.statement, ';');
};
