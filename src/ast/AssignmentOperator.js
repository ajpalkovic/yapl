function AssignmentOperator(operator) {
  this.operator = operator;
};

AssignmentOperator.compiledOperators = {
  MUL_EQUALS: '*=',
  DIV_EQUALS: '/=',
  MOD_EQUALS: '%=',
  PLUS_EQUALS: '+=',
  MINUS_EQUALS: '-=',
  CONDITIONAL_EQUALS: '||=',
  SHIFTL_EQUALS: '<<=',
  SHIFTR_EQUALS: '>>=',
  LOGICAL_SHIFTR_EQUALS: '>>>=',
  AND_EQUALS: '&=',
  XOR_EQUALS: '^=',
  OR_EQUALS: '|=',
  ASSIGN: '='
};

AssignmentOperator.prototype.compile = function() {
  compiler.out(AssignmentOperator.compiledOperators[this.operator]);
};
