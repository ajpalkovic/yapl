function ArrayMemberAccess(memberExpression, arrayDereference) {
  this.memberExpression = memberExpression;
  this.arrayDereference = arrayDereference;
};
ArrayMemberAccess.prototype = new MemberExpression();

ArrayMemberAccess.prototype.compile = function() {
  compiler.out(this.memberExpression, this.arrayDereference);
};

