var Grammar = {
  Program: {
    rule: [
      [],
      ['Program', 'SourceElement']
    ],

    onParse: function() {
      
    } 
  },

  SourceElement:  {
    rule: [
      ['Statement'],
      ['Class'],
      ['FunctionDeclaration'],
      ['Closure']
    ],

    onParse: function() {
      
    } 
  },

  Class: {
    rule: [
      ['CLASS', 'IDENTIFIER', 'NEWLINE', 'ClassBody', 'END'],
      ['CLASS', 'IDENTIFIER', 'EXTENDS', 'MemberExpression', 'NEWLINE', 'END']
    ],

    onParse: function() {
      
    } 
  },

  ClassBody: {
    rule: [
      [],
      ['ClassElement'],
      ['ClassBody', 'ClassElement']
    ],

    onParse: function() {
      
    } 
  },

  ClassElement: {
    rule: [
      ['InstanceVarDeclaration'],
      ['STATIC', 'OPEN_BRACE', 'StatementList', 'CLOSE_BRACE'],
      ['Method'],
      ['ClassDeclaration']
    ],

    onParse: function() {
      
    } 
  },

  Method: {
    rule: [
      ['FunctionDeclaration']
      ['STATIC', 'FunctionDeclaration']
    ],

    onParse: function() {
      
    } 
  },

  InstanceVarDeclaration: {
    rule: [
      ['VariableStatement', 'EndSt'],
      ['STATIC', 'VariableStatement', 'EndSt'],
      ['Accessor', 'VariableStatement', 'EndSt'],
      ['STATIC', 'Accessor', 'VariableStatement', 'EndSt'],
      ['Accessor', 'STATIC', 'VariableStatement', 'EndSt']
    ],

    onParse: function() {
      
    } 
  },

  Accessor: {
    rule: [
      ['GETTER'],
      ['SETTER'],
      ['ACCESSOR']
    ],

    onParse: function() {
      
    } 
  },

  FunctionDeclaration: {
    rule: [
      ['FUNCTION', 'IDENTIFIER', 'Parameters', 'FunctionBody', 'END']
    ],

    onParse: function() {
      
    } 
  },

  Closure: {
    rule: [
      ['CLOSURE', 'Parameters', 'SourceElements', 'END']
    ],

    onParse: function() {
      
    } 
  },

  FunctionExpression: {
    rule: [
      ['FUNCTION', 'Parameters', 'FunctionBody', 'END'],
      ['FUNCTION', 'IDENTIFIER', 'Parameters', 'FunctionBody', 'END']
    ],

    onParse: function() {
      
    } 
  },

  // TODO: rule w/ identifier
  ClassExpression: {
    rule: [
      ['CLASS', 'ClassBody', 'END']
    ],

    onParse: function() {
      
    } 
  },

  Parameters: {
    rule: [
      ['OPEN_PAREN',  'CLOSE_PAREN', ],
      ['OPEN_PAREN',  'ParameterList',   'CLOSE_PAREN'],
      ['OPEN_PAREN',  'VarArgs',   'CLOSE_PAREN'],
      ['OPEN_PAREN',  'ParameterList', 'COMMA', 'VarArgs', 'CLOSE_PAREN']
    ],

    onParse: function() {
      
    } 
  },

  ParameterList: {
    rule: [
      ['IDENTIFIER'],
      ['AutoSetParam'],
      ['DefaultArgument'],
      ['ParameterList', 'COMMA', 'IDENTIFIER']
    ],

    onParse: function() {
      
    } 
  },

  AutoSetParam: {
    rule: [
      ['AT', 'IDENTIFIER']
    ],

    onParse: function() {
      
    } 
  },

  DefaultArgument: {
    rule: [
      ['IDENTIFIER', 'EQUALS', 'Expression']
    ],

    onParse: function() {
      
    } 
  },

  VarArgs: {
    rule: [
      ['IDENTIFIER', 'ELLIPSES']
    ],

    onParse: function() {
      
    } 
  },

  FunctionBody: {
    rule: [
      [],
      ['FunctionBody', 'SourceElement']
    ],

    onParse: function() {
      
    } 
  },

  MemberIdentifier: {
    rule: [
      ['MEMBER', 'IDENTIFIER']
    ],

    onParse: function() {
      
    } 
  },

  ArrayLiteral: {
    rule: [
      ['OPEN_BRACKET', 'ArrayElements', 'CLOSE_BRACKET']
    ],

    onParse: function() {
      
    } 
  },

  ArrayElements: {
    rule: [
      [],
      ['Expression'],
      ['ArrayElements', 'COMMA'],
      ['ArrayElements', 'COMMA', 'Expression']
    ],

    onParse: function() {
      
    } 
  },

  ObjectLiteral: {
    rule: [
      ['OPEN_BRACE', 'CLOSE_BRACE'],
      ['OPEN_BRACE', 'Properties', 'CLOSE_BRACE']
    ],

    onParse: function() {
      
    } 
  },

  Properties: {
    rule: [
      ['Property']
      ['Properties', 'Property']
    ],

    onParse: function() {
      
    } 
  },

  Property: {
    rule: [
      ['PropertyName'],
      ['PropertyName', 'COLON', 'Expression']
    ],

    onParse: function() {
      
    } 
  },

  PropertyName: {
    rule: [
      ['IDENTIFIER'],
      ['STRING_LITERAL'],
      ['NUMERIC_LITERAL']
    ],

    onParse: function() {
      
    } 
  },

  ExpressionList: {
    rule: [
      ['Expression'],
      ['ExpressionList Expression']
    ],

    onParse: function() {
      
    } 
  },

  Expression: {
    rule: [
      ['LeftHandSideExpression'],

      ['Expression', 'AssignmentOperator', 'Expression'],
      ['Expression', 'QUESTION', 'Expression', 'COLON', 'Expression'],
      ['Expression', 'RelativeOperator', 'Expression']
      ['Expression', 'MultiplicationOperator', 'Expression'],
      ['Expression', 'AddOperator', 'Expression'],

      ['UnaryOperator', 'Expression'],
      ['INCREMENT', 'Expression'],
      ['Expression', 'INCREMENT'],
      ['DECREMENT', 'Expression'],
      ['Expression', 'DECREMENT']
    ],

    onParse: function() {
      
    } 
  },

  LeftHandSideExpression:  {
    rule: [
      ['NewExpression'],
      ['MemberExpression'],
      ['BindExpression']
    ],

    onParse: function() {
      
    } 
  },

  NewExpression:  {
    rule: [
      ['NEW', 'LeftHandSideExpression']
    ],

    onParse: function() {
      
    } 
  },

  MemberExpression:  {
    rule: [
      ['PrimaryExpression'],
      ['MemberExpression', 'ArrayDereference'],
      ['MemberExpression', 'DOT',  'IDENTIFIER'],
      ['MemberExpression', 'Arguments']
    ],

    onParse: function() {
      
    } 
  },

  BindExpression:  {
    rule: [
      ['BIND', 'MemberExpression']
    ],

    onParse: function() {
      
    } 
  },

  ArrayDereference: {
    rule: [
      ['OPEN_BRACKET', 'Expression', 'CLOSE_BRACKET']
    ],

    onParse: function() {
      
    } 
  },

  Arguments: {
    rule: [
      ['OPEN_PAREN', 'CLOSE_PAREN'],
      ['OPEN_PAREN', 'ArgumentList', 'CLOSE_PAREN']
    ],

    onParse: function() {
      
    } 
  },

  ArgumentList: {
    rule: [
      ['Expression'],
      ['ArgumentList', 'Expression']
    ],

    onParse: function() {
      
    } 
  },

  PrimaryExpression:  {
    rule: [
      ['THIS'],
      ['SUPER'],
      ['IDENTIFIER'],
      ['MemberIdentifier'],
      ['NUMERIC_LITERAL'],
      ['STRING_LITERAL'],
      ['SYMBOL'],
      ['REGEX'],
      ['ObjectLiteral'],
      ['ArrayLiteral'],
      ['OPEN_PAREN', 'ExpressionList', 'CLOSE_PAREN']
    ],

    onParse: function() {
      
    } 
  },

  AssignmentOperator: {
    rule: [
      ['MUL_EQUALS'],
      ['DIV_EQUALS'],
      ['MOD_EQUALS'],
      ['PLUS_EQUALS'],
      ['MINUS_EQUALS'],
      ['CONDITIONAL_EQUALS'],
      ['SHIFTL_EQUALS'],
      ['SHIFTR_EQUALS'],
      ['LOGICAL_SHIFTR_EQUALS'],
      ['AND_EQUALS'],
      ['XOR_EQUALS'],
      ['OR_EQUALS'],
      ['ASSIGN'],
    ],

    onParse: function() {
      
    } 
  },

  RelativeOperator: {
    rule: [
      ['EQUAL'],
      ['NOT_EQUAL'],
      ['LIKE'],
      ['UNLIKE'],
      ['LESS_THAN_EQUAL'],
      ['GREATER_THAN_EQUAL'],
      ['LESS_THAN'],
      ['GREATER_THAN'],
      ['LOGICAL_AND'],
      ['LOGICAL_OR'],
      ['BITWISE_AND'],
      ['BITWISE_OR'],
      ['XOR'],
      ['INSTANCEOF']
    ],

    onParse: function() {
      
    } 
  },

  UnaryOperator: {
    rule: [
      ['LOGICAL_NOT'],
      ['BITWISE_NOT'],
      ['QUESTION'],
      ['DELETE'],
      ['TYPEOF'],
      ['MINUS'],
      ['PLUS']
    ],

    onParse: function() {
      
    } 
  },

  AddOperator: {
    rule: [
      ['PLUS'],
      ['MINUS']
    ],

    onParse: function() {
      
    } 
  },

  MultiplicationOp: {
    rule: [
      ['ASTERISK'],
      ['SLASH'],
      ['MODULUS']
    ],

    onParse: function() {
      
    } 
  },

  Statement: {
    rule: [
      ['TerminatedStatement'],
      ['ComplexStatement']
    ],

    onParse: function() {
      
    } 
  },

  TerminatedStatement: {
    rule: [
      ['EmptyStatement'],
      ['SimpleStatement EndSt']
    ],

    onParse: function() {
      
    } 
  },

  ComplexStatement: {
    rule: [
      ['IfStatement'],
      ['UnlessStatement'],
      ['IterationStatement'],
      ['WithStatement'],
      ['SwitchStatement'],
      ['TryStatement']
    ],

    onParse: function() {
      
    } 
  },

  SimpleStatement: {
    rule: [
      ['VariableStatement'],
      ['ExpressionStatement'],
      ['BreakStatement'],
      ['ReturnStatement'],
      ['ContinueStatement'],
      ['LabelledStatement'],
      ['ThrowStatement'],
      ['DebuggerStatement']
    ],

    onParse: function() {
      
    } 
  }

  EndSt: {
    rule: [
      ['NEWLINE'],
      ['SEMI']
    ],

    onParse: function() {
      
    } 
  },

  StatementList:  {
    rule: [
      ['Statement'],
      ['StatementList Statement']
    ],

    onParse: function() {
      
    } 
  },

  EmptyStatement: {
    rule: [
      ['EndSt']
    ],

    onParse: function() {
      
    } 
  },

  ExpressionStatement: {
    rule: ,
    onParse: function() {
      
    } 
  },

  VariableStatement:  {
    rule: ,
    onParse: function() {
      
    } 
  },

  VariableDeclarationList:  {
    rule: ,
    onParse: function() {
      
    } 
  },

  VariableDeclaration:  {
    rule: ,
    onParse: function() {
      
    } 
  },

  IfStatement:  {
    rule: ,
    onParse: function() {
      
    } 
  },

  UnlessStatement: {
    rule: ,
    onParse: function() {
      
    } 
  },

  BlockBody: {
    rule: ,
    onParse: function() {
      
    } 
  },

  ElsePart: {
    rule: ,
    onParse: function() {
      
    } 
  },

  ElseIfPart: {
    rule: ,
    onParse: function() {
      
    } 
  },

  ElseIf: {
    rule: ,
    onParse: function() {
      
    } 
  },

  IterationStatement: {
    rule: ,
    onParse: function() {
      
    } 
  },

  WhileLoop: {
    rule: ,
    onParse: function() {
      
    } 
  },

  UntilLoop: {
    rule: ,
    onParse: function() {
      
    } 
  },

  DoUntilLoop: {
    rule: ,
    onParse: function() {
      
    } 
  },

  DoWhileLoop: {
    rule: ,
    onParse: function() {
      
    } 
  },

  ForLoop: {
    rule: ,
    onParse: function() {
      
    } 
  },

  ForLoopCondition: {
    rule: ,
    onParse: function() {
      
    } 
  },

  RegularForLoop: {
    rule: ,
    onParse: function() {
      
    } 
  },

  AdvancedForLoop: {
    rule: ,
    onParse: function() {
      
    } 
  },

  ContinueStatement: {
    rule: ,
    onParse: function() {
      
    } 
  },

  BreakStatement: {
    rule: ,
    onParse: function() {
      
    } 
  },

  ReturnStatement: {
    rule: ,
    onParse: function() {
      
    } 
  },

  WithStatement: {
    rule: ,
    onParse: function() {
      
    } 
  },

  SwitchStatement: {
    rule: ,
    onParse: function() {
      
    } 
  },

  CaseBlock: {
    rule: ,
    onParse: function() {
      
    } 
  },

  CaseClauses: {
    rule: ,
    onParse: function() {
      
    } 
  },

  CaseClause: {
    rule: ,
    onParse: function() {
      
    } 
  },

  CaseExpressionList: {
    rule: ,
    onParse: function() {
      
    } 
  },

  DefaultClause: {
    rule: ,
    onParse: function() {
      
    } 
  },

  AlwaysClause: {
    rule: ,
    onParse: function() {
      
    } 
  },

  LabelledStatement: {
    rule: ,
    onParse: function() {
      
    } 
  },

  ThrowStatement: {
    rule: ,
    onParse: function() {
      
    } 
  },

  TryStatement: {
    rule: ,
    onParse: function() {
      
    } 
  },

  Catch: {
    rule: ,
    onParse: function() {
      
    } 
  },

  Finally: {
    rule: ,
    onParse: function() {
      
    } 
  }
};
