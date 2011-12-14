function IfStatement(condition, ifBody, elseIfPart, elsePart) {
  this.condition = condition;
  this.ifBody = ifBody;
  this.elseIfPart = elseIfPart;
  this.elsePart = elsePart;
};

IfStatement.prototype.compile = function() {
  compiler.out('if (', this.condition, ') ', this.ifBody, this.elseIfPart, this.elsePart);
};
