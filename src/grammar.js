var Grammar = {
  Program: {
    productions: [
      ['SourceElement', 'Program'],
      ['SourceElement']
    ],

    onParse: function() {
      
    } 
  },

  SourceElement:  {
    productions: [
      ['Statement'],
      ['ClassDeclaration'],
      ['FunctionDeclaration'],
      ['Closure']
    ],

    onParse: function() {
      
    } 
  },

  ClassDeclaration: {
    productions: [
      ['CLASS', 'IDENTIFIER', 'NEWLINE', 'ClassBody', 'END'],
      ['CLASS', 'IDENTIFIER', 'EXTENDS', 'MemberExpression', 'NEWLINE', 'END']
    ],

    onParse: function() {
      
    } 
  },

  ClassBody: {
    productions: [
      ['ClassElement', 'ClassBody'],
      []
    ],

    onParse: function() {
      
    } 
  },

  ClassElement: {
    productions: [
      ['InstanceVarDeclaration'],
      ['STATIC', 'OPEN_BRACE', 'StatementList', 'CLOSE_BRACE'],
      ['Method'],
      ['ClassDeclaration']
    ],

    onParse: function() {
      
    } 
  },

  Method: {
    productions: [
      ['FunctionDeclaration']
      ['STATIC', 'FunctionDeclaration']
    ],

    onParse: function() {
      
    } 
  },

  InstanceVarDeclaration: {
    productions: [
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
    productions: [
      ['GETTER'],
      ['SETTER'],
      ['ACCESSOR']
    ],

    onParse: function() {
      
    } 
  },

  FunctionDeclaration: {
    productions: [
      ['FUNCTION', 'IDENTIFIER', 'Parameters', 'FunctionBody', 'END']
    ],

    onParse: function() {
      
    } 
  },

  Closure: {
    productions: [
      ['CLOSURE', 'Parameters', 'SourceElements', 'END']
    ],

    onParse: function() {
      
    } 
  },

  FunctionExpression: {
    productions: [
      ['FUNCTION', 'Parameters', 'FunctionBody', 'END'],
      ['FUNCTION', 'IDENTIFIER', 'Parameters', 'FunctionBody', 'END']
    ],

    onParse: function() {
      
    } 
  },

  // TODO: productions w/ identifier
  ClassExpression: {
    productions: [
      ['CLASS', 'ClassBody', 'END']
    ],

    onParse: function() {
      
    } 
  },

  Parameters: {
    productions: [
      ['OPEN_PAREN',  'CLOSE_PAREN', ],
      ['OPEN_PAREN',  'ParameterList',   'CLOSE_PAREN'],
      ['OPEN_PAREN',  'VarArgs',   'CLOSE_PAREN'],
      ['OPEN_PAREN',  'ParameterList', 'COMMA', 'VarArgs', 'CLOSE_PAREN']
    ],

    onParse: function() {
      
    } 
  },

  ParameterList: {
    productions: [
      ['Parameter', 'COMMA', 'ParameterList'],
      []
    ],

    onParse: function() {
      
    } 
  },

  Parameter: {
    productions: [
      ['IDENTIFIER'],
      ['AutoSetParam'],
      ['DefaultArgument']
    ],

    onParse: function() {
      
    } 
  },

  AutoSetParam: {
    productions: [
      ['AT', 'IDENTIFIER']
    ],

    onParse: function() {
      
    } 
  },

  DefaultArgument: {
    productions: [
      ['IDENTIFIER', 'EQUALS', 'Expression']
    ],

    onParse: function() {
      
    } 
  },

  VarArgs: {
    productions: [
      ['IDENTIFIER', 'ELLIPSES']
    ],

    onParse: function() {
      
    } 
  },

  FunctionBody: {
    productions: [
      ['SourceElement', 'FunctionBody'],
      []
    ],

    onParse: function() {
      
    } 
  },

  MemberIdentifier: {
    productions: [
      ['MEMBER', 'IDENTIFIER']
    ],

    onParse: function() {
      
    } 
  },

  ArrayLiteral: {
    productions: [
      ['OPEN_BRACKET', 'ArrayElements', 'CLOSE_BRACKET']
    ],

    onParse: function() {
      
    } 
  },

  ArrayElements: {
    productions: [
      ['ArrayElement'],
      ['ArrayElement', 'COMMA', 'ArrayElements']
    ],

    onParse: function() {
      
    } 
  },

  ArrayElement: {
    productions: [
      ['Expression'],
      []
    ],

    onParse: function() {
      
    } 
  },

  ObjectLiteral: {
    productions: [
      ['OPEN_BRACE', 'CLOSE_BRACE'],
      ['OPEN_BRACE', 'Properties', 'CLOSE_BRACE']
    ],

    onParse: function() {
      
    } 
  },

  Properties: {
    productions: [
      ['Property']
      ['Property', 'Properties']
    ],

    onParse: function() {
      
    } 
  },

  Property: {
    productions: [
      ['PropertyName'],
      ['PropertyName', 'COLON', 'Expression']
    ],

    onParse: function() {
      
    } 
  },

  PropertyName: {
    productions: [
      ['IDENTIFIER'],
      ['STRING_LITERAL'],
      ['NUMERIC_LITERAL']
    ],

    onParse: function() {
      
    } 
  },

  ExpressionList: {
    productions: [
      ['Expression'],
      ['Expression', 'COMMA', 'ExpressionList']
    ],

    onParse: function() {
      
    } 
  },

  Expression: {
    productions: [
      ['SimpleExpression', 'ASSIGN', 'Expression'],
      ['SimpleExpression', 'QUESTION', 'Expression', 'COLON', 'Expression'],
      ['SimpleExpression']

      // ['Expression', 'AssignmentOperator', 'Expression'],
      // ['Expression', 'QUESTION', 'Expression', 'COLON', 'Expression'],
      // ['Expression', 'RelativeOperator', 'Expression']
      // ['Expression', 'MultiplicationOperator', 'Expression'],
      // ['Expression', 'AddOperator', 'Expression'],

      // ['UnaryOperator', 'Expression'],
      // ['INCREMENT', 'Expression'],
      // ['Expression', 'INCREMENT'],
      // ['DECREMENT', 'Expression'],
      // ['Expression', 'DECREMENT']
    ],

    onParse: function() {
      
    } 
  },

  SimpleExpression: {
    productions: [
      ['AdditiveExpression', 'RelativeOperator', 'Expression'],
      ['AdditiveExpression']
    ],

    onParse: function() {
      
    } 
  },

  AdditiveExpression: {
    productions: [
      ['Term', 'MultiplicationOperator', 'Expression'],
      ['Term']
    ],

    onParse: function() {
      
    } 
  },

  Term: {
    productions: [
      ['IncrementExpression', 'AddOperator', 'Expression'],
      ['IncrementExpression']
    ],

    onParse: function() {
      
    } 
  },

  IncrementExpression: {
    productions: [
      ['UnaryExpression', 'DECREMENT'],
      ['UnaryExpression', 'INCREMENT'],
      ['INCREMENT', 'UnaryExpression'],
      ['DECREMENT', 'UnaryExpression'],
      ['UnaryExpression']
    ],

    onParse: function() {
      
    } 
  },

  UnaryExpression: {
    productions: [
      ['LOGICAL_NOT', 'UnaryExpression'],
      ['BITWISE_NOT', 'UnaryExpression'],
      ['QUESTION', 'UnaryExpression'],
      ['MINUS', 'UnaryExpression'],
      ['PLUS', 'UnaryExpression'],
      ['LeftHandSideExpression']
    ],

    onParse: function() {
      
    } 
  },

  LeftHandSideExpression:  {
    productions: [
      ['NewExpression'],
      ['MemberExpression'],
      ['BindExpression'],
      ['FunctionExpression'],
      ['ClassExpression']
    ],

    onParse: function() {
      
    } 
  },

  LeftHandSideExpressionNoDecl:  {
    productions: [
      ['NewExpression'],
      ['MemberExpression'],
      ['BindExpression']
    ],

    onParse: function() {
      
    } 
  },

  NewExpression:  {
    productions: [
      ['NEW', 'LeftHandSideExpression']
    ],

    onParse: function() {
      
    } 
  },

  MemberExpression:  {
    productions: [
      ['PrimaryExpression', 'MemberPart'],
      ['PrimaryExpression']
    ],

    onParse: function() {
      
    } 
  },

  MemberPart: {
    productions: [
      ['ArrayDereference', 'MemberPart'],
      ['DOT',  'IDENTIFIER', 'MemberPart'],
      ['Arguments', 'MemberPart']
    ],

    onParse: function() {
      
    } 
  },

  BindExpression:  {
    productions: [
      ['BIND', 'MemberExpression']
    ],

    onParse: function() {
      
    } 
  },

  ArrayDereference: {
    productions: [
      ['OPEN_BRACKET', 'Expression', 'CLOSE_BRACKET']
    ],

    onParse: function() {
      
    } 
  },

  Arguments: {
    productions: [
      ['OPEN_PAREN', 'CLOSE_PAREN'],
      ['OPEN_PAREN', 'ArgumentList', 'CLOSE_PAREN']
    ],

    onParse: function() {
      
    } 
  },

  ArgumentList: {
    productions: [
      ['Expression'],
      ['ArgumentList', 'Expression']
    ],

    onParse: function() {
      
    } 
  },

  PrimaryExpression:  {
    productions: [
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
    productions: [
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
    productions: [
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
    productions: [
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
    productions: [
      ['PLUS'],
      ['MINUS']
    ],

    onParse: function() {
      
    } 
  },

  MultiplicationOp: {
    productions: [
      ['ASTERISK'],
      ['SLASH'],
      ['MODULUS']
    ],

    onParse: function() {
      
    } 
  },

  Statement: {
    productions: [
      ['TerminatedStatement'],
      ['ComplexStatement']
    ],

    onParse: function() {
      
    } 
  },

  TerminatedStatement: {
    productions: [
      ['EmptyStatement'],
      ['SimpleStatement', 'EndSt']
    ],

    onParse: function() {
      
    } 
  },

  ComplexStatement: {
    productions: [
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
    productions: [
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
  },

  EndSt: {
    productions: [
      ['NEWLINE'],
      ['SEMI']
    ],

    onParse: function() {
      
    } 
  },

  StatementList:  {
    productions: [
      ['Statement'],
      ['StatementList Statement']
    ],

    onParse: function() {
      
    } 
  },

  EmptyStatement: {
    productions: [
      ['EndSt']
    ],

    onParse: function() {
      
    } 
  },

  ExpressionStatement: {
    productions: [
      ['Expression', '^FUNCTION']
    ],

    onParse: function() {
      
    } 
  },

  VariableStatement:  {
    productions: [
      ['VAR', 'VariableDeclarationList']
    ],

    onParse: function() {
      
    } 
  },

  VariableDeclarationList:  {
    productions: [
      ['VariableDeclaration'],
      ['VariableDeclarationList', 'COMMA', 'VariableDeclaration']
    ],

    onParse: function() {
      
    } 
  },

  VariableDeclaration:  {
    productions: [
      ['IDENTIFIER', 'ASSIGN', 'Expression'],
      ['IDENTIFIER']
    ],

    onParse: function() {
      
    } 
  },

  IfStatement:  {
    productions: [
      ['IF', 'Expression', 'NEWLINE', 'BlockBody', 'END'],
      ['IF', 'Expression', 'NEWLINE', 'BlockBody', 'ElsePart', 'END'],
      ['IF', 'Expression', 'NEWLINE', 'BlockBody', 'ElseIfPart', 'END'],
      ['IF', 'Expression', 'NEWLINE', 'BlockBody', 'ElseIfPart', 'ElsePart', 'END'],
      ['SimpleStatement', 'IF', 'Expression', 'EndSt']
    ],

    onParse: function() {
      
    } 
  },

  UnlessStatement: {
    productions: [
      ['UNLESS', 'Expression', 'NEWLINE', 'BlockBody', 'END'],
      ['SimpleStatement', 'UNLESS', 'Expression', 'EndSt']
    ],

    onParse: function() {
      
    } 
  },

  BlockBody: {
    productions: [
      ['StatementList'],
      []
    ],

    onParse: function() {
      
    } 
  },

  ElsePart: {
    productions: [
      ['ELSE', 'BlockBody']
    ],

    onParse: function() {
      
    } 
  },

  ElseIfPart: {
    productions: [
      ['ElseIf'],
      ['ElseIfPart', 'ElseIf']
    ],

    onParse: function() {
      
    } 
  },

  ElseIf: {
    productions: [
      ['ELSE', '!NEWLINE', 'IF', 'Expression', 'NEWLINE', 'BlockBody']
    ],

    onParse: function() {
      
    } 
  },

  IterationStatement: {
    productions: [
      ['WhileLoop'],
      ['UntilLoop'],
      ['DoUntilLoop'],
      ['DoWhileLoop'],
      ['ForLoop']
    ],

    onParse: function() {
      
    } 
  },

  WhileLoop: {
    productions: [
      ['WHILE', 'Expression', 'NEWLINE', 'BlockBody']
    ],

    onParse: function() {
      
    } 
  },

  UntilLoop: {
    productions: [
      ['UNTIL', 'Expression', 'NEWLINE', 'BlockBody']
    ],
    onParse: function() {
      
    } 
  },

  DoUntilLoop: {
    productions: [
      ['DO', 'BlockBody', '!NEWLINE', 'UNTIL', 'Expression', 'EndSt']
    ],

    onParse: function() {
      
    } 
  },

  DoWhileLoop: {
    productions: [
      ['DO', 'BlockBody', '!NEWLINE', 'WHILE', 'Expression', 'EndSt']
    ],

    onParse: function() {
      
    } 
  },

  ForLoop: {
    productions: [
      ['FOR', 'ForLoopCondition', 'NEWLINE', 'BlockBody', 'END']
    ],

    onParse: function() {
      
    } 
  },

  ForLoopCondition: {
    productions: [
      ['RegularForLoop'],
      ['AdvancedForLoop']
    ],

    onParse: function() {
      
    } 
  },

  RegularForLoop: {
    productions: [
      ['SEMI', 'SEMI'],
      ['Expression', 'SEMI', 'SEMI'],
      ['SEMI', 'Expression', 'SEMI'],
      ['SEMI', 'SEMI', 'Expression'],
      ['Expression', 'SEMI', 'Expression', 'SEMI'],
      ['SEMI', 'Expression', 'SEMI', 'Expression'],
      ['Expression', 'SEMI', 'SEMI', 'Expression'],
      ['Expression', 'SEMI', 'Expression', 'SEMI', 'Expression'],
    ],

    onParse: function() {
      
    } 
  },

  AdvancedForLoop: {
    productions: [
      ['Expression', 'IN', 'Expression'],
      ['Expression', 'IN', 'Expression', 'AT', 'IDENTIFIER'],
      ['Expression', 'COMMA', 'IDENTIFIER', 'IN', 'Expression'],
      ['Expression', 'COMMA', 'IDENTIFIER', 'IN', 'Expression', 'AT', 'IDENTIFIER'],
      ['Expression', 'AT', 'IDENTIFIER']
    ],

    onParse: function() {
      
    } 
  },

  ContinueStatement: {
    productions: [
      ['CONTINUE'],
      ['CONTINUE IDENTIFIER']
    ],

    onParse: function() {
      
    } 
  },

  BreakStatement: {
    productions: [
      ['BREAK'],
      ['BREAK IDENTIFIER']
    ],

    onParse: function() {
      
    } 
  },

  ReturnStatement: {
    productions: [
      ['RETURN'],
      ['RETURN Expression']
    ],

    onParse: function() {
      
    } 
  },

  WithStatement: {
    productions: [
      ['WITH', 'Expression', 'NEWLINE', 'BlockBody', 'END']
    ],

    onParse: function() {
      
    } 
  },

  SwitchStatement: {
    productions: [
      ['SWITCH', 'Expression', 'CaseBlock', 'END']
    ],

    onParse: function() {
      
    } 
  },

  CaseBlock: {
    productions: [
      ['CaseClauses'],
      ['DefaultClause'],
      ['AlwaysClause'],

      ['CaseClauses', 'DefaultClause'],
      ['CaseClauses', 'AlwaysClause'],
      ['DefaultClause', 'AlwaysClause'],
      ['DefaultClause', 'CaseClauses'],
      ['AlwaysClause', 'CaseClauses'],
      ['AlwaysClause', 'DefaultClause'],

      ['CaseClauses', 'DefaultClause', 'CaseClauses'],
      ['CaseClauses', 'DefaultClause', 'AlwaysClause'],
      ['CaseClauses', 'AlwaysClause', 'CaseClases'],
      ['CaseClauses', 'AlwaysClause', 'DefaultClause'],
      ['DefaultClause', 'CaseClauses', 'AlwaysClause'],
      ['DefaultClause', 'AlwaysClause', 'CaseClauses'],
      ['AlwaysClause', 'CaseClauses', 'DefaultClause'],
      ['AlwaysClause', 'DefaultClause', 'CaseClauses'],

      ['CaseClauses', 'DefaultClause', 'CaseClauses', 'AlwaysClause'],
      ['CaseClauses', 'AlwaysClause', 'CaseClauses', 'DefaultClause'],
      ['CaseClauses', 'DefaultClause', 'AlwaysClause', 'CaseClauses'],
      ['CaseClauses', 'AlwaysClause', 'DefaultClause', 'CaseClauses'],
      ['DefaultClause', 'CaseClauses', 'AlwaysClause', 'CaseClauses'],
      ['AlwaysClause', 'CaseClauses', 'DefaultClause', 'CaseClauses'],
    ],

    onParse: function() {
      
    } 
  },

  CaseClauses: {
    productions: [
      ['CaseClause'],
      ['CaseClauses', 'CaseClause']
    ],

    onParse: function() {
      
    } 
  },

  CaseClause: {
    productions: [
      ['CASE', 'ExpressionList', 'COLON', 'BlockBody']
    ],

    onParse: function() {
      
    } 
  },

  DefaultClause: {
    productions: [
      ['DEFAULT', 'COLON', 'BlockBody']
    ],

    onParse: function() {
      
    } 
  },

  LabelledStatement: {
    productions: [
      ['IDENTIFIER', 'COLON', 'Statement'],
      ['IDENTIFIER', 'COLON', 'BlockBody', 'END']
    ],

    onParse: function() {
      
    } 
  },

  ThrowStatement: {
    productions: [
      ['THROW', 'Expression']
    ],

    onParse: function() {
      
    } 
  },

  TryStatement: {
    productions: [
      ['TRY', 'Catch', 'END'],
      ['TRY', 'Finally', 'END'],
      ['TRY', 'Catch', 'Finally', 'END'],
      ['TRY', 'StatementList', 'Catch', 'END'],
      ['TRY', 'StatementList', 'Finally', 'END'],
      ['TRY', 'StatementList', 'Catch', 'Finally', 'END']
    ],

    onParse: function() {
      
    } 
  },

  Catch: {
    productions: [
      ['CATCH', 'NEWLINE', 'BlockBody'],
      ['CATCH', 'IDENTIFIER', 'NEWLINE', 'BlockBody']
    ],

    onParse: function() {
      
    } 
  },

  Finally: {
    productions: [
      ['FINALLY', 'BlockBody']
    ],

    onParse: function() {
      
    } 
  },

  DebuggerStatement: {
    productions: [
      ['DEBUGGER']
    ],

    onParse: function() {
      
    } 
  }
};
