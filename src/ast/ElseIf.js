function ElseIf(condition, body) {
  this.condition = condition;
  this.body = body;
};

ElseIf.prototype.compile = function() {
  compiler.out(' else if (', this.condition, ') ', this.body);
};

