function MemberAccess(memberExpression, member) {
  this.memberExpression = memberExpression;
  this.member = member;
};
MemberAccess.prototype = new MemberExpression();

MemberAccess.prototype.compile = function() {
  MemberExpression.prototype.compile.call(this);
  compiler.out('.', this.member);
};

