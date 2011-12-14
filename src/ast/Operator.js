function Operator(operator) {
  this.operator = operator;
};

Operator.compiledOperators = {
  // Assignments
  MUL_EQUALS: '*=',
  DIV_EQUALS: '/=',
  MOD_EQUALS: '%=',
  PLUS_EQUALS: '+=',
  MINUS_EQUALS: '-=',
  SHIFTL_EQUALS: '<<=',
  SHIFTR_EQUALS: '>>=',
  LOGICAL_SHIFTR_EQUALS: '>>>=',
  AND_EQUALS: '&=',
  XOR_EQUALS: '^=',
  OR_EQUALS: '|=',
  ASSIGN: '=',

  // Incrementing
  INCREMENT: '++',
  DECREMENT: '--',

  // Relative
  EQUAL: '===',
  NOT_EQUAL: '!==',
  LIKE: '==',
  UNLIKE: '!=',
  LESS_THAN_EQUAL: '<=',
  GREATER_THAN_EQUAL: '>=',
  LESS_THAN: '<',
  GREATER_THAN: '>',
  LOGICAL_AND: '&&',
  LOGICAL_OR: '||',
  BITWISE_AND: '&',
  BITWISE_OR: '|',
  XOR: '^',

  // Additive
  PLUS: '+',
  MINUS: '-',

  // Multiplicative
  ASTERISK: '*',
  SLASH: '/',
  MODULUS: '%'
};

Operator.prototype.compile = function() {
  compiler.out(this.operator);
};
