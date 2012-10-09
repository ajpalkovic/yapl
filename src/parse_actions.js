!function($) {
  /**
   * Creates a new parse action for a list node.
   */
  function list(NodeListClass) {
    return $.overload(function() {
      return new NodeListClass();
    }, function(firstElement) {
      return new NodeListClass(firstElement);
    }, function(element, nodeList) {
      nodeList.add(element);
      return nodeList;
    });
  }

  /**
   * Default parse action to create a node with the parameters of the parse
   * action passed in as the parameters to the constructor.
   */
  function node(NodeClass) {
    return function() {
      var context = Function.create(NodeClass.name, [], '');

      context.prototype = NodeClass.prototype;
      var instance = new context();

      NodeClass.apply(instance, arguments);
      return instance;
    };
  }

  with (nodes) {
    var ParseActions = {
      Program: list(Program),
      ClassDeclaration: node(ClassDeclaration),
      ClassBody: list(ClassBody),
      Method: node(Method),
      StaticMethod: node(StaticMethod),
      Accessor: node(Accessor),
      FunctionDeclaration: node(FunctionDeclaration),
      Closure: node(Closure),
      FunctionExpression: node(FunctionExpression),
      EmptyList: list(NodeList),
      ParameterList: list(ParameterList),
      AutoSetParam: node(AutoSetParam),
      DefaultArgument: node(DefaultArgument),
      FunctionBody: list(FunctionBody),
      MemberIdentifier: node(MemberIdentifier),
      ArrayLiteral: node(ArrayLiteral),
      ArrayElementList: list(CommaNodeList),
      ObjectLiteral: node(ObjectLiteral),
      PropertyList: node(PropertyList),
      Property: node(Property),
      AssignmentExpression: node(AssignmentExpression),
      ConditionalExpression: node(ConditionalExpression),

      SimpleExpression: $.overload(function(expression) {
        return expression;
      }, function(additiveExpression, relativeOperator, expression) {
        return new SimpleExpression(additiveExpression, relativeOperator, expression);
      }),

      AdditiveExpression: $.overload(function(expression) {
        return expression;
      }, function(term, multiplicativeOperator, expression) {
        return new AdditiveExpression(term, multiplicativeOperator, expression);
      }),

      Term: $.overload(function(expression) {
        return expression;
      }, function(unaryExpression, additiveExpression, expression) {
        return new Term(unaryExpression, additiveExpression, expression);
      }),

      UnaryExpression: $.overload(function(expression) {
        return expression;
      }, function(type, expression) {
        return new UnaryExpression(type, expression);
      }),

      PostfixIncrementExpression: node(PostfixIncrementExpression),
      PrefixIncrementExpression: node(PrefixIncrementExpression),
      NewExpression: node(NewExpression),

      MemberExpression: $.overload(function(primaryExpression) {
        return primaryExpression
      }, function(primaryExpression, memberPart) {
        memberPart.add(primaryExpression);
        return memberPart;
      }),

      MemberPart: list(MemberPart),
      PropertyAccess: node(PropertyAccess),
      BindExpression: node(BindExpression),
      ArrayDereference: node(ArrayDereference),
      ConditionalLoad: node(ConditionalLoad),
      Call: node(Call),
      ArgumentList: list(ArgumentList),
      Reference: node(Reference),
      IdentifierReference: node(IdentifierReference),
      FunctionReference: node(FunctionReference),
      PrimitiveLiteralExpression: node(PrimitiveLiteralExpression),
      NestedExpression: node(NestedExpression),
      Operator: node(Operator),
      TerminatedStatement: node(TerminatedStatement),
      StatementList: list(NodeList),
      EmptyStatement: node(EmptyStatement),

      // EndSt: {
      //   onParse: function(type) {
      //     return {
      //       node: 'EndSt',
      //       type: type
      //     };
      //   }
      // },

      VariableStatement: node(VariableStatement),
      VariableDeclarationList: list(VariableDeclarationList),
      VariableDeclaration: node(VariableDeclaration),
      IfStatement: node(IfStatement),
      OneLineIfStatement: node(OneLineIfStatement),
      UnlessStatement: node(UnlessStatement),
      OneLineUnlessStatement: node(OneLineUnlessStatement),
      ElsePart: node(ElsePart),
      ElseIfList: list(NodeList),
      ElseIf: node(ElseIf),
      WhileLoop: node(WhileLoop),
      UntilLoop: node(UntilLoop),
      // DoWhileLoop: node(DoWhileLoop),
      // DoUntilLoop: node(DoUntilLoop),
      StandardForStructure: node(StandardForStructure),
      ForInStructure: node(ForInStructure),
      MultipleForInStructure: node(MultipleForInStructure),
      InflectedForStructure: node(InflectedForStructure),
      ContinueStatement: node(KeywordStatement),
      BreakStatement: node(KeywordStatement),
      ReturnStatement: node(KeywordStatement),
      WithStatement: node(WithStatement),
      SwitchStatement: node(SwitchStatement),
      CaseBlock: node(CaseBlock),
      CaseList: list(NodeList),
      Case: node(Case),
      CaseExpressionList: list(NodeList),
      OptDefaultCase: node(OptDefaultCase),
      DefaultCase: node(DefaultCase),
      LabeledStatement: node(LabeledStatement),
      ThrowStatement: node(KeywordStatement),
      TryStatement: node(TryStatement),
      OptCatch: node(OptCatch),
      OptFinally: node(OptFinally),
      Catch: node(Catch),
      Finally: node(Finally),
      DebuggerStatement: node(KeywordStatement),
    };
  }

  window.ParseActions = ParseActions;
}(jQuery);
