!function($) {
  /**
   * Creates a new parse action for a list node.
   */
  function list(type) {
    return $.overload(function() {
      return new Node(type);
    }, function(firstElement) {
      return new Node(type, [firstElement]);
    }, function(element, nodeList) {
      nodeList.add(element);
      return nodeList;
    });
  }

  /**
   * Default parse action to create a node with the parameters of the parse
   * action passed in as the parameters to the constructor.
   */
  function node(type, childNames) {
    return function() {
      var args = Array.prototype.slice.call(arguments, 0);
      return new Node(type, args, childNames);
    };
  }

  function flatteningNode(type, childNames) {
    return function() {
      if (arguments.length === 1) return arguments[0];

      return node(type, childNames).apply(this, arguments);
    }
  }

  var ParseActions = {
    Program: list('Program'),
    ClassDeclaration: node('ClassDeclaration', ['name', 'parentClass', 'body']),
    ClassBody: list('ClassBody'),
    Method: node('Method', ['name', 'parameters', 'body']),
    StaticMethod: node('StaticMethod'),
    Accessor: node('Accessor'),
    FunctionDeclaration: node('FunctionDeclaration', ['name', 'parameters', 'body']),
    Closure: node('Closure', ['parameters', 'body']),
    FunctionExpression: node('FunctionExpression', ['name', 'parameters', 'body']),
    EmptyList: list('NodeList'),
    ParameterList: list('ParameterList'),
    AutoSetParam: node('AutoSetParam', ['name']),
    DefaultArgument: node('DefaultArgument', ['name', 'value']),
    FunctionBody: list('FunctionBody'),
    MemberIdentifier: node('MemberIdentifier', ['name']),
    ArrayLiteral: node('ArrayLiteral', ['elements']),
    ArrayElementList: list('CommaNodeList'),
    ObjectLiteral: node('ObjectLiteral'),
    PropertyList: node('PropertyList'),
    Property: node('Property', ['name', 'value']),
    AssignmentExpression: node('AssignmentExpression', ['left', 'operator', 'right']),
    ConditionalExpression: node('ConditionalExpression'),
    SimpleExpression: flatteningNode('SimpleExpression', ['left', 'operator', 'right']),
    AdditiveExpression: flatteningNode('AdditiveExpression', ['left', 'operator', 'right']),
    Term: flatteningNode('Term', ['left', 'operator', 'right']),
    ExponentiationExpression: flatteningNode('ExponentiationExpression'),
    UnaryExpression: flatteningNode('UnaryExpression'),
    PostfixIncrementExpression: node('PostfixIncrementExpression'),
    PrefixIncrementExpression: node('PrefixIncrementExpression'),
    NewExpression: node('NewExpression'),

    MemberExpression: $.overload(function(primaryExpression) {
      return primaryExpression
    }, function(primaryExpression, memberChain) {
      memberChain.add(primaryExpression);

      // Make the hierarchy from the flattened chain.
      var elements = memberChain.children;
      while (elements.length > 1) {
        var member = elements[0];
        var compoundExpression = elements[1];

        var newCompoundExpression = new Node(compoundExpression.type,
          [member, compoundExpression.children[0]],
          ['member', 'memberPart']);

        elements.splice(0, 2, newCompoundExpression);
      }

      return elements[0];
    }),

    MemberChain: list('MemberChain'),
    PropertyAccess: node('PropertyAccess', ['property']),
    BindExpression: node('BindExpression', ['call']),
    ArrayDereference: node('ArrayDereference', ['index']),
    ConditionalLoad: node('ConditionalLoad', ['property']),
    Call: node('Call'),
    ArgumentList: list('ArgumentList'),
    Reference: node('Reference'),
    IdentifierReference: node('IdentifierReference'),
    FunctionReference: node('FunctionReference'),
    PrimitiveLiteralExpression: node('PrimitiveLiteralExpression'),
    NestedExpression: node('NestedExpression'),
    Operator: node('Operator'),
    TerminatedStatement: node('TerminatedStatement'),
    StatementList: list('NodeList'),

    EmptyStatement: function(type) {
      if (type.value === '\n') return undefined;

      return node('EmptyStatement').apply(this, [type]);
    },

    // EndSt: {
    //   onParse: function(type) {
    //     return {
    //       node: 'EndSt',
    //       type: type
    //     };
    //   }
    // },

    VariableStatement: node('VariableStatement'),
    VariableDeclarationList: list('VariableDeclarationList'),
    VariableDeclaration: node('VariableDeclaration'),
    IfStatement: node('IfStatement'),
    OneLineIfStatement: node('OneLineIfStatement'),
    UnlessStatement: node('UnlessStatement'),
    OneLineUnlessStatement: node('OneLineUnlessStatement'),
    ElsePart: node('ElsePart'),
    ElseIfList: list('NodeList'),
    ElseIf: node('ElseIf'),
    WhileLoop: node('WhileLoop'),
    UntilLoop: node('UntilLoop'),
    // DoWhileLoop: node('DoWhileLoop'),
    // DoUntilLoop: node('DoUntilLoop'),
    StandardForStructure: node('StandardForStructure'),
    ForInStructure: node('ForInStructure'),
    MultipleForInStructure: node('MultipleForInStructure'),
    InflectedForStructure: node('InflectedForStructure'),
    ContinueStatement: node('KeywordStatement'),
    BreakStatement: node('KeywordStatement'),
    ReturnStatement: node('KeywordStatement'),
    WithStatement: node('WithStatement'),
    SwitchStatement: node('SwitchStatement'),
    CaseBlock: node('CaseBlock'),
    CaseList: list('NodeList'),
    Case: node('Case'),
    CaseExpressionList: list('NodeList'),
    OptDefaultCase: node('OptDefaultCase'),
    DefaultCase: node('DefaultCase'),
    LabeledStatement: node('LabeledStatement'),
    ThrowStatement: node('KeywordStatement'),
    TryStatement: node('TryStatement'),
    OptCatch: node('OptCatch'),
    OptFinally: node('OptFinally'),
    Catch: node('Catch'),
    Finally: node('Finally'),
    DebuggerStatement: node('KeywordStatement'),
  };

  window.ParseActions = ParseActions;
}(jQuery);
