function ElsePart(body) {
  this.body = body;
};

ElsePart.prototype.compile = function() {
  compiler.out(' else ', this.body);
};
