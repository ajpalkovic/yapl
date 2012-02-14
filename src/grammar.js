var Grammar = {
  Program: {
    productions: [
      ['SourceElement', 'Program'],
      ['SourceElement'],
      ['<<EOF>>']
    ],

    onParse: function(sourceElement, program) {
      program = program || {
        type: 'Program',
        sourceElements: []
      };

      program.sourceElements.splice(0, 0, sourceElement);
      return program;
    }
  },

  SourceElement:  {
    productions: [
      ['Statement'],
      ['ClassDeclaration'],
      ['FunctionDeclaration'],
      ['Closure']
    ],

    onParse: function(sourceElement) {
      return sourceElement;
    }
  },

  ClassDeclaration: {
    productions: [
      ['CLASS', 'IDENTIFIER', 'NEWLINE', 'ClassBody', 'END'],
      ['CLASS', 'IDENTIFIER', 'EXTENDS', 'MemberExpression', 'NEWLINE', 'END']
    ],

    onParse: function(identifier, ) {
      
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
      ['StaticBlock'],
      ['Method'],
      ['ClassDeclaration']
    ],

    onParse: function() {
      
    } 
  },

  StaticBlock: {
    productions: [
      ['STATIC', 'OPEN_BRACE', 'StatementList', 'CLOSE_BRACE']
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
      ['CLOSURE', 'Parameters', 'FunctionBody', 'END']
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
      ['OPEN_PAREN', 'CLOSE_PAREN'],
      ['OPEN_PAREN', 'ParameterList', 'CLOSE_PAREN'],
      ['OPEN_PAREN', 'VarArgs', 'CLOSE_PAREN'],
      ['OPEN_PAREN', 'ParameterList', 'COMMA', 'VarArgs', 'CLOSE_PAREN']
    ],

    onParse: function() {
      
    } 
  },

  ParameterList: {
    productions: [
      ['Parameter', 'COMMA', 'ParameterList'],
      ['Parameter']
    ],

    onParse: function() {
      
    } 
  },

  Parameter: {
    productions: [
      ['DefaultArgument'],
      ['AutoSetParam'],
      ['IDENTIFIER']
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
      ['IDENTIFIER', 'ASSIGN', 'Expression']
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
      ['ArrayElement', 'COMMA', 'ArrayElements'],
      ['ArrayElement']
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
      ['OPEN_BRACE', 'Properties', 'CLOSE_BRACE'],
      ['OPEN_BRACE', 'CLOSE_BRACE']
    ],

    onParse: function() {
      
    } 
  },

  Properties: {
    productions: [
      ['Property', 'ObjPropDelim', 'Properties'],
      ['Property']
    ],

    onParse: function() {
      
    } 
  },

  ObjPropDelim: {
    productions: [
      ['NEWLINE'],
      ['COMMA', 'NEWLINE'],
      ['COMMA']
    ],

    onParse: function() {
      
    } 
  },

  Property: {
    productions: [
      ['PropertyName', 'COLON', 'Expression'],
      ['PropertyName']
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
      ['Expression', 'COMMA', 'ExpressionList'],
      ['Expression']
    ],

    onParse: function() {
      
    } 
  },

  Expression: {
    productions: [
      ['SimpleExpression', 'ASSIGN', 'Expression'],
      ['SimpleExpression', 'QUESTION', 'Expression', 'COLON', 'Expression'],
      ['SimpleExpression']
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
      ['BindExpression'],
      ['MemberExpression'],
      ['FunctionExpression'],
      ['ClassExpression'],
      ['Closure']
    ],

    onParse: function() {
      
    } 
  },

  LeftHandSideExpressionNoDecl:  {
    productions: [
      ['NewExpression'],
      ['BindExpression'],
      ['MemberExpression']
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
      ['Arguments', 'MemberPart'],
      []
    ],

    onParse: function() {
      
    } 
  },

  BindExpression:  {
    productions: [
      ['MemberExpression', 'LESS_THAN', 'ArgumentList', 'GREATER_THAN']
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
      ['OPEN_PAREN', 'ArgumentList', 'CLOSE_PAREN'],
      ['ArgumentList']
    ],

    onParse: function() {
      
    } 
  },

  ArgumentList: {
    productions: [
      ['Expression', 'COMMA', 'ArgumentList'],
      ['Expression']
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

  MultiplicationOperator: {
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
      ['SEMI'],
      ['<<EOF>>']
    ],

    onParse: function() {
      
    } 
  },

  StatementList:  {
    productions: [
      ['Statement', 'StatementList'],
      ['Statement']
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
      ['Expression']
    ],

    lookahead: {
      'FUNCTION': false
    },

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
      ['VariableDeclaration', 'COMMA', 'VariableDeclarationList'],
      ['VariableDeclaration']
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
      ['IF', 'Expression', 'NEWLINE', 'BlockBody', 'ElseIfPart', 'ElsePart', 'END'],
      ['IF', 'Expression', 'NEWLINE', 'BlockBody', 'ElseIfPart', 'END'],
      ['IF', 'Expression', 'NEWLINE', 'BlockBody', 'ElsePart', 'END'],
      ['IF', 'Expression', 'NEWLINE', 'BlockBody', 'END'],
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
      ['ElseIf', 'ElseIfPart'],
      ['ElseIf']
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
      ['Expression', 'IN', 'Expression', 'AT', 'IDENTIFIER'],
      ['Expression', 'IN', 'Expression'],
      ['Expression', 'COMMA', 'IDENTIFIER', 'IN', 'Expression', 'AT', 'IDENTIFIER'],
      ['Expression', 'COMMA', 'IDENTIFIER', 'IN', 'Expression'],
      ['Expression', 'AT', 'IDENTIFIER']
    ],

    onParse: function() {
      
    } 
  },

  ContinueStatement: {
    productions: [
      ['CONTINUE', 'IDENTIFIER'],
      ['CONTINUE']
    ],

    onParse: function() {
      
    } 
  },

  BreakStatement: {
    productions: [
      ['BREAK', 'IDENTIFIER'],
      ['BREAK']
    ],

    onParse: function() {
      
    } 
  },

  ReturnStatement: {
    productions: [
      ['RETURN', 'Expression'],
      ['RETURN']
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
    ],

    onParse: function() {
      
    } 
  },

  CaseClauses: {
    productions: [
      ['CaseClause', 'CaseClauses']
      ['CaseClause']
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
      ['IDENTIFIER', 'COLON', 'BlockBody', 'END'],
      ['IDENTIFIER', 'COLON', 'Statement']
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
      ['TRY', 'StatementList', 'Catch', 'Finally', 'END'],
      ['TRY', 'StatementList', 'Finally', 'END'],
      ['TRY', 'StatementList', 'Catch', 'END'],
      ['TRY', 'Catch', 'Finally', 'END'],
      ['TRY', 'Finally', 'END'],
      ['TRY', 'Catch', 'END']
    ],

    onParse: function() {
      
    } 
  },

  Catch: {
    productions: [
      ['CATCH', 'IDENTIFIER', 'NEWLINE', 'BlockBody'],
      ['CATCH', 'NEWLINE', 'BlockBody']
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
