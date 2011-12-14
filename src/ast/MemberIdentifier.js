function MemberIdentifier(name) {
  this.name = name;
};

MemberIdentifier.prototype.compile = function() {
  var member = new MemberAccess(new PrimaryExpression('THIS'), this.name);
  compiler.out(member);
};
