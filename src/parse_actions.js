!function($) {
  /**
   * Creates a new parse action for a list node.
   */
  function list(type) {
    return $.overload(function() {
      return $node(type);
    }, function(firstElement) {
      var node = $node(type, [firstElement]);
      return node;
    }, function(element, nodeList) {
      nodeList.prepend(element);
      return nodeList;
    }, function(element, delimiter, nodeList) {
      nodeList.prepend(element);
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
      var node = $node(type, args, childNames);

      return node;
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
    InstanceVarDeclarationStatement: node('InstanceVarDeclarationStatement'),
    InstanceVarDeclarationList: list('InstanceVarDeclarationList'),
    InstanceVarDeclaration: node('InstanceVarDeclaration', ['name', 'value']),
    StaticVarDeclarationStatement: node('StaticVarDeclarationStatement'),
    Accessor: node('Accessor', ['type', 'variables']),
    AccessorVariable: node('AccessorVariable', ['name']),
    AccessorList: list('AcessorList'),
    FunctionDeclaration: node('FunctionDeclaration', ['name', 'parameters', 'body']),
    Closure: node('Closure', ['parameters', 'body']),
    ClosureParameter: node('ClosureParameter', ['name', 'value']),
    FunctionExpression: node('FunctionExpression', ['name', 'parameters', 'body']),
    EmptyList: list('NodeList'),
    ParameterList: list('ParameterList'),
    AutoSetParam: node('AutoSetParam'),
    FunctionBody: list('FunctionBody'),
    MemberIdentifier: node('MemberIdentifier', ['name']),
    ArrayLiteral: node('ArrayLiteral', ['elements']),
    ArrayElementList: list('CommaNodeList'),
    ObjectLiteral: node('ObjectLiteral'),
    PropertyList: list('PropertyList'),
    Property: node('Property', ['name', 'value']),
    AssignmentExpression: node('AssignmentExpression', ['left', 'operator', 'right']),
    ParallelAssignmentExpression: node('ParallelAssignmentExpression', ['left', 'operator', 'right']),
    MemberExpressionList: list('MemberExpressionList'),
    ExpressionList: list('ExpressionList'),
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
      memberChain.prepend(primaryExpression);

      // Make the hierarchy from the flattened chain.
      var tree = memberChain.children().first().remove();

      while (memberChain.children().length) {
        var memberPart = memberChain.children().first().remove();

        var type = memberPart.type();

        tree = $node(type,
          [tree, memberPart.children().first()],
          ['member', 'memberPart']);
      }

      return tree;
    }),

    MemberChain: list('MemberChain'),
    PropertyAccess: node('PropertyAccess', ['property']),
    BindExpression: node('BindExpression', ['call']),
    ArrayDereference: node('ArrayDereference', ['index']),
    ConditionalLoad: node('ConditionalLoad', ['property']),
    Call: node('Call'),
    ArgumentList: list('ArgumentList'),
    This: node('This'),
    Super: node('Super'),
    Symbol: node('Symbol'),
    RegexLiteral: node('RegexLiteral'),
    DoubleStringLiteral: node('DoubleStringLiteral'),
    SingleStringLiteral: node('SingleStringLiteral'),
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
    VariableDeclaration: node('VariableDeclaration', ['name', 'value']),
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
    ForLoop: node('ForLoop', ['structure', 'body']),
    StandardForStructure: node('StandardForStructure'),
    ForInStructure: node('ForInStructure', ['value', 'collection', 'index']),
    MultipleForInStructure: node('MultipleForInStructure', ['key', 'value', 'collection', 'index']),
    InflectedForStructure: node('InflectedForStructure', ['collection']),
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
