var Grammar = {
  Program: {
    productions: [
      ['SourceElement', 'Program'],
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
      ['CLASS', '(IDENTIFIER)', 'EXTENDS', 'MemberExpression', 'NEWLINE', 'ClassBody', 'END'],
      ['CLASS', '(IDENTIFIER)', 'NEWLINE', 'ClassBody', 'END']
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
      ['(GETS)', 'VariableDeclarationList'],
      ['(SETS)', 'VariableDeclarationList'],
      ['(ACCESSES)', 'VariableDeclarationList']
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
      ['FUNCTION', '(IDENTIFIER)', 'Parameters', 'FunctionBody', 'END']
    ]
  },

  // TODO: productions w/ identifier
  ClassExpression: {
    productions: [
      ['CLASS', '(IDENTIFIER)', 'NEWLINE', 'ClassBody', 'END'],
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
      ['MEMBER', '(IDENTIFIER)']
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
      ['OPEN_BRACKET', 'ArrayElementList', 'CLOSE_BRACKET']
    ]
  },

  ArrayElementList: {
    productions: [
      ['ArrayElement', 'COMMA', 'ArrayElementList'],
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
      ['OPEN_BRACE', 'PropertyList', 'CLOSE_BRACE'],
      ['OPEN_BRACE', 'CLOSE_BRACE']
    ]
  },

  PropertyList: {
    productions: [
      ['Property', 'ObjPropDelim', 'PropertyList'],
      ['Property']
    ]
  },

  ObjPropDelim: {
    productions: [
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
      ['Call'],
      ['BindExpression']
    ]
  },

  Call: {
    productions: [
      ['Arguments']
    ],

    // This prevents calling a function with its arguments on the next
    // line.  It originally arose from the following ambiguity (but there
    // are obviously more):
    //
    //    if a
    //      function b
    //        return 1337
    //      end
    //    end
    //
    // In this case, because we support paren-less function calls and
    // complex statements, should this be parsed where the condition of
    // the 'if' statement is calling the function 'a' passing it function
    // 'b' as its parameter, or should the condition be simply 'a'?
    // We opt for the latter.
    lookahead: {
      'NEWLINE': false
    }
  },

  PropertyAccess: {
    productions: [
      ['DOT',  '(IDENTIFIER)']
    ]
  },

  BindExpression:  {
    productions: [
      ['BIND', 'Call']
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
      ['OPEN_PAREN', 'Expression', 'CLOSE_PAREN']
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
      ['EmptyStatement']
    ]
  },

  ComplexStatement: {
    productions: [
      ['FunctionDeclaration'],
      ['IfStatement'],
      ['UnlessStatement'],
      ['OneLineIfStatement'],
      ['OneLineUnlessStatement'],
      ['IterationStatement'],
      ['WithStatement'],
      ['SwitchStatement'],
      ['LabelledStatement'],
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
      ['ThrowStatement'],
      ['DebuggerStatement']
    ]
  },

  EmptyStatement: {
    productions: [
      ['SEMI']
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
      'FUNCTION': false,
      'CLASS': false
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
      ['IF', 'Expression', 'NEWLINE', 'BlockBody', 'ElseIfList', 'ElsePart', 'END'],
      ['IF', 'Expression', 'NEWLINE', 'BlockBody', 'ElseIfList', 'END'],
      ['IF', 'Expression', 'NEWLINE', 'BlockBody', 'ElsePart', 'END'],
      ['IF', 'Expression', 'NEWLINE', 'BlockBody', 'END']
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

  DoWhileLoop: {
    productions: [
      ['DO', 'BlockBody', '!NEWLINE', 'WHILE', 'Expression', 'EndSt']
    ]
  },

  DoUntilLoop: {
    productions: [
      ['DO', 'BlockBody', '!NEWLINE', 'UNTIL', 'Expression', 'EndSt']
    ]
  },

  ForLoop: {
    productions: [
      ['FOR', 'ForLoopStructure', 'NEWLINE', 'BlockBody', 'END']
    ]
  },

  ForLoopStructure: {
    productions: [
      ['StandardForStructure'],
      ['ForInStructure'],
      ['MultipleForInStructure'],
      ['InflectedForStructure']
    ]
  },

  StandardForStructure: {
    productions: [
      ['ForLoopInitializer', 'SEMI', 'OptionalExpression', 'SEMI', 'OptionalExpression']
    ]
  },

  ForLoopInitializer: {
    productions: [
      ['VariableStatement'],
      ['LeftHandSideExpression'],
      []
    ]
  },

  OptionalExpression: {
    productions: [
      ['Expression'],
      []
    ]
  },

  ForInStructure: {
    productions: [
      ['VariableDeclaration', 'IN', 'Expression', 'AT', 'VariableDeclaration'],
      ['VariableDeclaration', 'IN', 'Expression']
    ]
  },

  MultipleForInStructure: {
    productions: [
      ['VariableDeclaration', 'COMMA', 'VariableDeclaration', 'IN', 'Expression', 'AT', 'VariableDeclaration'],
      ['VariableDeclaration', 'COMMA', 'VariableDeclaration', 'IN', 'Expression']
    ]
  },

  InflectedForStructure: {
    productions: [
      ['Expression', 'AT', 'VariableDeclaration']
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
      ['SWITCH', 'Expression', 'NEWLINE', 'CaseBlock', 'END']
    ]
  },

  CaseBlock: {
    productions: [
      ['CaseClauseList', 'DefaultClause', 'CaseClauseList'],
      ['CaseClauseList', 'DefaultClause'],
      ['DefaultClause', 'CaseClauseList'],
      ['CaseClauseList'],
      ['DefaultClause'],
    ]
  },

  CaseClauseList: {
    productions: [
      ['CaseClause', 'CaseClauseList']
      ['CaseClause']
    ]
  },

  CaseClause: {
    productions: [
      ['CASE', 'CaseExpressionList', 'COLON', 'BlockBody']
    ]
  },

  CaseExpressionList: {
    productions: [
      ['Expression', 'COMMA', 'CaseExpressionList'],
      ['Expression']
    ]
  },

  DefaultClause: {
    productions: [
      ['DEFAULT', 'COLON', 'BlockBody']
    ]
  },

  LabelledStatement: {
    productions: [
      ['(IDENTIFIER)', 'COLON', 'Statement']
    ]
  },

  ThrowStatement: {
    productions: [
      ['THROW', 'Expression']
    ]
  },

  TryStatement: {
    productions: [
      ['TRY', 'BlockBody', 'Catch', 'Finally', 'END'],
      ['TRY', 'BlockBody', 'Finally', 'END'],
      ['TRY', 'BlockBody', 'Catch', 'END'],
      ['TRY', 'Catch', 'Finally', 'END'],
      ['TRY', 'Finally', 'END'],
      ['TRY', 'Catch', 'END']
    ]
  },

  Catch: {
    productions: [
      ['CATCH', '(IDENTIFIER)', 'NEWLINE', 'BlockBody'],
      ['CATCH', 'BlockBody']
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
