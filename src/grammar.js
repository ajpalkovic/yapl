var Grammar = {
  Program: {
    productions: [
      ['SourceElement', 'Program'],
      ['SourceElement'],
      ['<<EOF>>']
    ]
  },

  SourceElement:  {
    productions: [
      ['Statement'],
      ['ClassDeclaration'],
      ['FunctionDeclaration'],
      ['Closure']
    ]
  },

  ClassDeclaration: {
    productions: [
      ['CLASS', '(IDENTIFIER)', 'NEWLINE', 'ClassBody', 'END'],
      ['CLASS', '(IDENTIFIER)', 'EXTENDS', 'MemberExpression', 'NEWLINE', 'ClassBody', 'END']
    ]
  },

  ClassBody: {
    productions: [
      ['ClassElement', 'ClassBody'],
      []
    ]
  },

  ClassElement: {
    productions: [
      ['Accessor'],
      ['Statement'],
      ['StaticMethod'],
      ['StaticVarDeclaration'],
      ['ClassDeclaration']
    ]
  },

  StaticMethod: {
    productions: [
      ['STATIC', 'FunctionDeclaration']
    ]
  },

  StaticVarDeclaration: {
    productions: [
      ['STATIC', 'VariableStatement', 'EndSt']
    ]
  },

  Accessor: {
    productions: [
      ['(GETTER)', 'VariableDeclarationList'],
      ['(SETTER)', 'VariableDeclarationList'],
      ['(ACCESSOR)', 'VariableDeclarationList']
    ]
  },

  FunctionDeclaration: {
    productions: [
      ['FUNCTION', '(IDENTIFIER)', 'Parameters', 'FunctionBody', 'END']
    ]
  },

  Closure: {
    productions: [
      ['CLOSURE', 'Parameters', 'FunctionBody', 'END']
    ]
  },

  FunctionExpression: {
    productions: [
      ['FUNCTION', 'Parameters', 'FunctionBody', 'END'],
      ['FUNCTION', 'IDENTIFIER', 'Parameters', 'FunctionBody', 'END']
    ]
  },

  // TODO: productions w/ identifier
  ClassExpression: {
    productions: [
      ['CLASS', 'ClassBody', 'END']
    ]
  },

  Parameters: {
    productions: [
      ['OPEN_PAREN', 'CLOSE_PAREN'],
      ['OPEN_PAREN', 'ParameterList', 'CLOSE_PAREN']
    ]
  },

  ParameterList: {
    productions: [
      ['Parameter', 'COMMA', 'ParameterList'],
      ['Parameter']
    ]
  },

  Parameter: {
    productions: [
      ['DefaultArgument'],
      ['AutoSetParam'],
      ['(IDENTIFIER)']
    ]
  },

  AutoSetParam: {
    productions: [
      ['AT', 'IDENTIFIER']
    ]
  },

  DefaultArgument: {
    productions: [
      ['(IDENTIFIER)', 'ASSIGN', 'Expression']
    ]
  },

  FunctionBody: {
    productions: [
      ['SourceElement', 'FunctionBody'],
      []
    ]
  },

  MemberIdentifier: {
    productions: [
      ['MEMBER', 'IDENTIFIER']
    ]
  },

  ArrayLiteral: {
    productions: [
      ['OPEN_BRACKET', 'ArrayElements', 'CLOSE_BRACKET']
    ]
  },

  ArrayElements: {
    productions: [
      ['ArrayElement', 'COMMA', 'ArrayElements'],
      ['ArrayElement']
    ]
  },

  ArrayElement: {
    productions: [
      ['Expression'],
      []
    ]
  },

  ObjectLiteral: {
    productions: [
      ['OPEN_BRACE', 'Properties', 'CLOSE_BRACE'],
      ['OPEN_BRACE', 'CLOSE_BRACE']
    ]
  },

  Properties: {
    productions: [
      ['Property', 'ObjPropDelim', 'Properties'],
      ['Property']
    ]
  },

  ObjPropDelim: {
    productions: [
      ['COMMA', 'NEWLINE'],
      ['COMMA']
    ]
  },

  Property: {
    productions: [
      ['PropertyName', 'COLON', 'Expression'],
      ['PropertyName']
    ]
  },

  PropertyName: {
    productions: [
      ['(IDENTIFIER)'],
      ['(STRING_LITERAL)'],
      ['(NUMERIC_LITERAL)']
    ]
  },

  ExpressionList: {
    productions: [
      ['Expression', 'COMMA', 'ExpressionList'],
      ['Expression']
    ]
  },

  Expression: {
    productions: [
      ['AssignmentExpression'],
      ['ConditionalExpression'],
      ['SimpleExpression']
    ]
  },

  AssignmentExpression: {
    productions: [
      ['SimpleExpression', 'ASSIGN', 'Expression']
    ]
  },

  ConditionalExpression: {
    productions: [
      ['SimpleExpression', 'QUESTION', 'Expression', 'COLON', 'Expression']
    ]
  },

  SimpleExpression: {
    productions: [
      ['AdditiveExpression', 'RelativeOperator', 'Expression'],
      ['AdditiveExpression']
    ]
  },

  AdditiveExpression: {
    productions: [
      ['Term', 'MultiplicativeOperator', 'Expression'],
      ['Term']
    ]
  },

  Term: {
    productions: [
      ['UnaryExpression', 'AdditiveOperator', 'Expression'],
      ['UnaryExpression']
    ]
  },

  UnaryExpression: {
    productions: [
      ['LOGICAL_NOT', 'UnaryExpression'],
      ['BITWISE_NOT', 'UnaryExpression'],
      ['QUESTION', 'UnaryExpression'],
      ['MINUS', 'UnaryExpression'],
      ['PLUS', 'UnaryExpression'],
      ['IncrementExpression']
    ]
  },

  IncrementExpression: {
    productions: [
      ['PostfixIncrementExpression'],
      ['PrefixIncrementExpression'],
      ['LeftHandSideExpression']
    ]
  },

  PostfixIncrementExpression: {
    productions: [
      ['LeftHandSideExpression', '(DECREMENT)'],
      ['LeftHandSideExpression', '(INCREMENT)']
    ]
  },

  PrefixIncrementExpression: {
    productions: [
      ['(INCREMENT)', 'LeftHandSideExpression'],
      ['(DECREMENT)', 'LeftHandSideExpression']
    ]
  },

  LeftHandSideExpression:  {
    productions: [
      ['NewExpression'],
      ['MemberExpression'],
      ['FunctionExpression'],
      ['ClassExpression'],
      ['BindExpression'],
      ['Closure']
    ]
  },

  NewExpression:  {
    productions: [
      ['NEW', 'LeftHandSideExpression']
    ]
  },

  MemberExpression:  {
    productions: [
      ['PrimaryExpression', 'MemberPart'],
      ['PrimaryExpression']
    ]
  },

  MemberPart: {
    productions: [
      ['Member', 'MemberPart'],
      ['Member']
    ]
  },

  Member: {
    productions: [
      ['ArrayDereference'],
      ['PropertyAccess'],
      ['Arguments'],
      ['BindExpression']
    ]
  },

  PropertyAccess: {
    productions: [
      ['DOT',  '(IDENTIFIER)']
    ]
  },

  BindExpression:  {
    productions: [
      ['LESS_THAN', 'ArgumentList', 'GREATER_THAN']
    ]
  },

  ArrayDereference: {
    productions: [
      ['OPEN_BRACKET', 'Expression', 'CLOSE_BRACKET']
    ]
  },

  Arguments: {
    productions: [
      ['OPEN_PAREN', 'CLOSE_PAREN'],
      ['OPEN_PAREN', 'ArgumentList', 'CLOSE_PAREN'],
      ['ArgumentList']
    ]
  },

  ArgumentList: {
    productions: [
      ['Expression', 'COMMA', 'ArgumentList'],
      ['Expression']
    ]
  },

  PrimaryExpression:  {
    productions: [
      ['(THIS)'],
      ['(SUPER)'],
      ['(TRUE)'],
      ['(FALSE)'],
      ['(IDENTIFIER)'],
      ['MemberIdentifier'],
      ['(NUMERIC_LITERAL)'],
      ['(STRING_LITERAL)'],
      ['(REGEX_LITERAL)'],
      ['(SYMBOL)'],
      ['(REGEX)'],
      ['ObjectLiteral'],
      ['ArrayLiteral'],
      ['NestedExpression']
    ]
  },

  NestedExpression: {
    productions: [
      ['OPEN_PAREN', 'ExpressionList', 'CLOSE_PAREN']
    ]
  },

  AssignmentOperator: {
    nodeType: 'Operator',
    productions: [
      ['(MUL_EQUALS)'],
      ['(DIV_EQUALS)'],
      ['(MOD_EQUALS)'],
      ['(PLUS_EQUALS)'],
      ['(MINUS_EQUALS)'],
      ['(EXPONENTIATION_EQUALS)']
      ['(CONDITIONAL_EQUALS)'],
      ['(SHIFTL_EQUALS)'],
      ['(SHIFTR_EQUALS)'],
      ['(LOGICAL_SHIFTR_EQUALS)'],
      ['(AND_EQUALS)'],
      ['(XOR_EQUALS)'],
      ['(OR_EQUALS)'],
      ['(ASSIGN)'],
    ]
  },

  RelativeOperator: {
    nodeType: 'Operator',
    productions: [
      ['(EQUAL)'],
      ['(NOT_EQUAL)'],
      ['(LIKE)'],
      ['(UNLIKE)'],
      ['(LESS_THAN_EQUAL)'],
      ['(GREATER_THAN_EQUAL)'],
      ['(LESS_THAN)'],
      ['(GREATER_THAN)'],
      ['(COMPARE_TO)'],
      ['(LOGICAL_AND)'],
      ['(LOGICAL_OR)'],
      ['(BITWISE_AND)'],
      ['(BITWISE_OR)'],
      ['(XOR)'],
      ['(INSTANCEOF)']
    ]
  },

  UnaryOperator: {
    nodeType: 'Operator',
    productions: [
      ['(LOGICAL_NOT)'],
      ['(BITWISE_NOT)'],
      ['(QUESTION)'],
      ['(DELETE)'],
      ['(TYPEOF)'],
      ['(MINUS)'],
      ['(PLUS)']
    ]
  },

  AdditiveOperator: {
    nodeType: 'Operator',
    productions: [
      ['(PLUS)'],
      ['(MINUS)']
    ]
  },

  MultiplicativeOperator: {
    nodeType: 'Operator',
    productions: [
      ['(ASTERISK)'],
      ['(FORWARD_SLASH)'],
      ['(MODULUS)']
    ]
  },

  StatementList:  {
    productions: [
      ['Statement', 'StatementList'],
      ['Statement']
    ]
  },

  Statement: {
    productions: [
      ['TerminatedStatement'],
      ['ComplexStatement']
    ]
  },

  TerminatedStatement: {
    productions: [
      ['SimpleStatement', 'EndSt'],
      ['EndSt']
    ]
  },

  ComplexStatement: {
    productions: [
      ['IfStatement'],
      ['UnlessStatement'],
      ['OneLineIfStatement'],
      ['OneLineUnlessStatement'],
      ['IterationStatement'],
      ['WithStatement'],
      ['SwitchStatement'],
      ['TryStatement']
    ]
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
    ]
  },

  EndSt: {
    productions: [
      ['NEWLINE'],
      ['SEMI'],
      ['<<EOF>>']
    ]
  },

  ExpressionStatement: {
    productions: [
      ['Expression']
    ],

    lookahead: {
      'FUNCTION': false
    }
  },

  VariableStatement:  {
    productions: [
      ['VAR', 'VariableDeclarationList']
    ]
  },

  VariableDeclarationList:  {
    productions: [
      ['VariableDeclaration', 'COMMA', 'VariableDeclarationList'],
      ['VariableDeclaration']
    ]
  },

  VariableDeclaration:  {
    productions: [
      ['(IDENTIFIER)', 'ASSIGN', 'Expression'],
      ['(IDENTIFIER)']
    ]
  },

  IfStatement:  {
    productions: [
      //['IF', 'Expression', 'NEWLINE', 'BlockBody', 'ElseIfList', 'ElsePart', 'END'],
      ['IF', 'Expression', 'NEWLINE', 'BlockBody', 'ElseIfList', 'END'],
      //['IF', 'Expression', 'NEWLINE', 'BlockBody', 'ElsePart', 'END'],
      //['IF', 'Expression', 'NEWLINE', 'BlockBody', 'END']
    ]
  },

  OneLineIfStatement: {
    productions: [
      ['SimpleStatement', 'IF', 'Expression', 'EndSt']
    ]
  },

  UnlessStatement: {
    productions: [
      ['UNLESS', 'Expression', 'NEWLINE', 'BlockBody', 'END']
    ]
  },

  OneLineUnlessStatement: {
    productions: [
      ['SimpleStatement', 'UNLESS', 'Expression', 'EndSt']
    ]
  },

  BlockBody: {
    productions: [
      ['StatementList'],
      []
    ]
  },

  ElsePart: {
    productions: [
      ['ELSE', 'BlockBody']
    ]
  },

  ElseIfList: {
    productions: [
      ['ElseIf', 'ElseIfList'],
      ['ElseIf']
    ]
  },

  ElseIf: {
    productions: [
      ['ELSE', '!NEWLINE', 'IF', 'Expression', 'NEWLINE', 'BlockBody']
    ]
  },

  IterationStatement: {
    productions: [
      ['WhileLoop'],
      ['UntilLoop'],
      ['DoUntilLoop'],
      ['DoWhileLoop'],
      ['ForLoop']
    ]
  },

  WhileLoop: {
    productions: [
      ['WHILE', 'Expression', 'NEWLINE', 'BlockBody']
    ]
  },

  UntilLoop: {
    productions: [
      ['UNTIL', 'Expression', 'NEWLINE', 'BlockBody']
    ]
  },

  DoUntilLoop: {
    productions: [
      ['DO', 'BlockBody', '!NEWLINE', 'UNTIL', 'Expression', 'EndSt']
    ]
  },

  DoWhileLoop: {
    productions: [
      ['DO', 'BlockBody', '!NEWLINE', 'WHILE', 'Expression', 'EndSt']
    ]
  },

  ForLoop: {
    productions: [
      ['FOR', 'ForLoopCondition', 'NEWLINE', 'BlockBody', 'END']
    ]
  },

  ForLoopCondition: {
    productions: [
      ['RegularForLoop'],
      ['AdvancedForLoop']
    ]
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
    ]
  },

  AdvancedForLoop: {
    productions: [
      ['Expression', 'IN', 'Expression', 'AT', 'IDENTIFIER'],
      ['Expression', 'IN', 'Expression'],
      ['Expression', 'COMMA', 'IDENTIFIER', 'IN', 'Expression', 'AT', 'IDENTIFIER'],
      ['Expression', 'COMMA', 'IDENTIFIER', 'IN', 'Expression'],
      ['Expression', 'AT', 'IDENTIFIER']
    ]
  },

  ContinueStatement: {
    productions: [
      ['CONTINUE', 'IDENTIFIER'],
      ['CONTINUE']
    ]
  },

  BreakStatement: {
    productions: [
      ['BREAK', 'IDENTIFIER'],
      ['BREAK']
    ]
  },

  ReturnStatement: {
    productions: [
      ['RETURN', 'Expression'],
      ['RETURN']
    ]
  },

  WithStatement: {
    productions: [
      ['WITH', 'Expression', 'NEWLINE', 'BlockBody', 'END']
    ]
  },

  SwitchStatement: {
    productions: [
      ['SWITCH', 'Expression', 'CaseBlock', 'END']
    ]
  },

  CaseBlock: {
    productions: [
      ['CaseClauses', 'DefaultClause', 'CaseClauses', 'AlwaysClause'],
      ['CaseClauses', 'AlwaysClause', 'CaseClauses', 'DefaultClause'],
      ['CaseClauses', 'DefaultClause', 'AlwaysClause', 'CaseClauses'],
      ['CaseClauses', 'AlwaysClause', 'DefaultClause', 'CaseClauses'],
      ['DefaultClause', 'CaseClauses', 'AlwaysClause', 'CaseClauses'],
      ['AlwaysClause', 'CaseClauses', 'DefaultClause', 'CaseClauses'],

      ['CaseClauses', 'DefaultClause', 'CaseClauses'],
      ['CaseClauses', 'DefaultClause', 'AlwaysClause'],
      ['CaseClauses', 'AlwaysClause', 'CaseClases'],
      ['CaseClauses', 'AlwaysClause', 'DefaultClause'],
      ['DefaultClause', 'CaseClauses', 'AlwaysClause'],
      ['DefaultClause', 'AlwaysClause', 'CaseClauses'],
      ['AlwaysClause', 'CaseClauses', 'DefaultClause'],
      ['AlwaysClause', 'DefaultClause', 'CaseClauses'],

      ['CaseClauses', 'DefaultClause'],
      ['CaseClauses', 'AlwaysClause'],
      ['DefaultClause', 'AlwaysClause'],
      ['DefaultClause', 'CaseClauses'],
      ['AlwaysClause', 'CaseClauses'],
      ['AlwaysClause', 'DefaultClause'],

      ['CaseClauses'],
      ['DefaultClause'],
      ['AlwaysClause']
    ]
  },

  CaseClauses: {
    productions: [
      ['CaseClause', 'CaseClauses']
      ['CaseClause']
    ]
  },

  CaseClause: {
    productions: [
      ['CASE', 'ExpressionList', 'COLON', 'BlockBody']
    ]
  },

  DefaultClause: {
    productions: [
      ['DEFAULT', 'COLON', 'BlockBody']
    ]
  },

  LabelledStatement: {
    productions: [
      ['IDENTIFIER', 'COLON', 'BlockBody', 'END'],
      ['IDENTIFIER', 'COLON', 'Statement']
    ]
  },

  ThrowStatement: {
    productions: [
      ['THROW', 'Expression']
    ]
  },

  TryStatement: {
    productions: [
      ['TRY', 'StatementList', 'Catch', 'Finally', 'END'],
      ['TRY', 'StatementList', 'Finally', 'END'],
      ['TRY', 'StatementList', 'Catch', 'END'],
      ['TRY', 'Catch', 'Finally', 'END'],
      ['TRY', 'Finally', 'END'],
      ['TRY', 'Catch', 'END']
    ]
  },

  Catch: {
    productions: [
      ['CATCH', 'IDENTIFIER', 'NEWLINE', 'BlockBody'],
      ['CATCH', 'NEWLINE', 'BlockBody']
    ]
  },

  Finally: {
    productions: [
      ['FINALLY', 'BlockBody']
    ]
  },

  DebuggerStatement: {
    productions: [
      ['DEBUGGER']
    ]
  }
};
