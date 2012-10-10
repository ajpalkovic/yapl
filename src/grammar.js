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
      ['Closure']
    ]
  },

  ClassDeclaration: {
    productions: [
      ['CLASS', '(IDENTIFIER)', 'EXTENDS', 'ParentClass', 'NEWLINE', 'ClassBody', 'END'],
      ['CLASS', '(IDENTIFIER)', 'NEWLINE', 'ClassBody', 'END']
    ]
  },

  ParentClass: {
    productions: [
      ['Reference', 'DOT', 'ParentClass'],
      ['Reference']
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
      ['Method'],
      ['StaticMethod'],
      ['StaticVarDeclaration'],
      ['ClassDeclaration']
    ]
  },

  Method: {
    productions: [
      ['DEF', '(IDENTIFIER)', 'Parameters', 'FunctionBody', 'END']
    ]
  },

  StaticMethod: {
    productions: [
      ['STATIC', 'Method']
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

  Parameters: {
    productions: [
      ['OPEN_PAREN', 'EmptyList', 'CLOSE_PAREN'],
      ['OPEN_PAREN', 'ParameterList', 'CLOSE_PAREN']
    ]
  },

  EmptyList: {
    productions: [
      []
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
      ['OPEN_BRACE', 'EmptyList', 'CLOSE_BRACE']
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
      ['LeftHandSideExpression', 'ASSIGN', 'Expression']
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
      ['UnaryOperator', 'UnaryExpression'],
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
      ['PrimaryExpression', 'MemberChain'],
      ['PrimaryExpression']
    ]
  },

  MemberChain: {
    productions: [
      ['Member', 'MemberChain'],
      ['Member']
    ]
  },

  Member: {
    productions: [
      ['ArrayDereference'],
      ['PropertyAccess'],
      ['ConditionalLoad'],
      ['Call'],
      ['BindExpression']
    ]
  },

  ConditionalLoad: {
    productions: [
      ['DOT_DOT', 'PrimaryExpression']
    ]
  },

  Call: {
    productions: [
      ['OPEN_PAREN', 'EmptyList', 'CLOSE_PAREN'],
      ['OPEN_PAREN', 'ArgumentList', 'CLOSE_PAREN'],
      ['ArgumentList']
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
      ['(STRING_LITERAL)'],
      ['(REGEX_LITERAL)'],
      ['(SYMBOL)'],
      ['(REGEX)'],
      ['IdentifierReference'],
      ['FunctionReference'],
      ['PrimitiveLiteralExpression'],
      ['MemberIdentifier'],
      ['ObjectLiteral'],
      ['ArrayLiteral'],
      ['NestedExpression']
    ]
  },

  Reference: {
    productions: [
      ['(IDENTIFIER)']
    ]
  },

  IdentifierReference: {
    productions: [
      ['(IDENTIFIER)']
    ]
  },

  FunctionReference: {
    productions: [
      ['BITWISE_AND', '(IDENTIFIER)']
    ]
  },

  PrimitiveLiteralExpression: {
    productions: [
      ['(TRUE)'],
      ['(FALSE)'],
      ['(NUMERIC_LITERAL)']
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
      []
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
      ['SimpleStatementNoFunction', 'EndSt'],
      ['EmptyStatement']
    ]
  },

  ComplexStatement: {
    productions: [
      ['OneLineIfStatement'],
      ['OneLineUnlessStatement'],
      ['FunctionDeclaration'],
      ['IfStatement'],
      ['UnlessStatement'],
      ['IterationStatement'],
      ['WithStatement'],
      ['SwitchStatement'],
      ['LabeledStatement'],
      ['TryStatement']
    ]
  },

  SimpleStatementNoFunction: {
    productions: [
      ['VariableStatement'],
      ['ExpressionStatement'],
      ['BreakStatement'],
      ['ReturnStatement'],
      ['ContinueStatement'],
      ['ThrowStatement'],
      ['DebuggerStatement'],
    ],

    lookahead: {
      'FUNCTION': false
    }
  },

  SimpleStatement: {
    productions: [
      ['VariableStatement'],
      ['ExpressionStatement'],
      ['BreakStatement'],
      ['ReturnStatement'],
      ['ContinueStatement'],
      ['ThrowStatement'],
      ['DebuggerStatement'],
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
    ]
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
      ['SimpleStatement', 'IF', 'Expression']
    ]
  },

  UnlessStatement: {
    productions: [
      ['UNLESS', 'Expression', 'NEWLINE', 'BlockBody', 'END']
    ]
  },

  OneLineUnlessStatement: {
    productions: [
      ['SimpleStatement', 'UNLESS', 'Expression']
    ]
  },

  BlockBody: {
    productions: [
      ['StatementList']
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
      ['WHILE', 'Expression', 'NEWLINE', 'BlockBody', 'END']
    ]
  },

  UntilLoop: {
    productions: [
      ['UNTIL', 'Expression', 'NEWLINE', 'BlockBody', 'END']
    ]
  },

  // TODO(tjclifton): making these work will be a huge pain.

  // DoWhileLoop: {
  //   productions: [
  //     ['DO', 'BlockBody', '!NEWLINE', 'WHILE', 'Expression', 'EndSt']
  //   ]
  // },

  // DoUntilLoop: {
  //   productions: [
  //     ['DO', 'BlockBody', '!NEWLINE', 'UNTIL', 'Expression', 'EndSt']
  //   ]
  // },

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
      ['(CONTINUE)', '(IDENTIFIER)'],
      ['(CONTINUE)']
    ]
  },

  BreakStatement: {
    productions: [
      ['(BREAK)', '(IDENTIFIER)'],
      ['(BREAK)']
    ]
  },

  ReturnStatement: {
    productions: [
      ['(RETURN)', 'Expression'],
      ['(RETURN)']
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
      ['CaseList', 'OptDefaultCase', 'CaseList']
    ]
  },

  CaseList: {
    productions: [
      ['Case', 'CaseList'],
      []
    ]
  },

  Case: {
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

  OptDefaultCase: {
    productions: [
      ['DefaultCase'],
      [],
    ]
  },

  DefaultCase: {
    productions: [
      ['DEFAULT', 'COLON', 'BlockBody']
    ]
  },

  LabeledStatement: {
    productions: [
      ['(IDENTIFIER)', 'COLON', 'Statement']
    ]
  },

  ThrowStatement: {
    productions: [
      ['(THROW)', 'Expression']
    ]
  },

  TryStatement: {
    productions: [
      ['TRY', 'BlockBody', 'OptCatch', 'OptFinally', 'END'],
    ]
  },

  OptCatch: {
    productions: [
      ['Catch'],
      []
    ]
  },

  OptFinally: {
    productions: [
      ['Finally'],
      []
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
      ['(DEBUGGER)']
    ]
  }
};

