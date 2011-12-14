function TerminatedStatement(statement) {
  this.statement = statement;
};

TerminatedStatement.prototype.compile = function() {
  compiler.out(this.statement, ';');
};

