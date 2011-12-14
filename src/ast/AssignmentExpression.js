function AssignmentExpression(leftHandSide, assignmentOperator, value) {
  this.leftHandSide = leftHandSide;
  this.assignmentOperator = assignmentOperator;
  this.value = value;
};

AssignmentExpression.prototype.compile = function() {
  compiler.out(this.leftHandSide);
  if (this.value) {
    console.log(this.assignmentOperator);
    if (this.assignmentOperator.operator === '||=') {
      compiler.out(new Operator('='), this.leftHandSide, new Operator('||'), this.value);
    } else {
      compiler.out(this.assignmentOperator, this.value);
    }
  }
};
