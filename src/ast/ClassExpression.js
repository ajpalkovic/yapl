function ClassExpression(name, classBody) {
  this.name = name;
  this.classBody = classBody;
};

ClassExpression.prototype.compile = function() {
  compiler.out(new ClassDeclaration(this.name, undefined, this.classBody));
};

