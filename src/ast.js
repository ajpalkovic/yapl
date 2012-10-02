!function($) {
  function findConstructor(className, classBody) {
    for (var i = 0; i < classBody.length; ++i) {
      var classElement = classBody[i];
      if (classElement.node === 'FunctionDeclaration' && classElement.name === className) return classElement;
    }
  }

  window.nodes = {};

  /**
   * Base node class.
   */
  var Node = klass(nodes, {}, {
    initialize: function Node() {
      this.name = this.constructor.name;
    },

    toString: function() {
      return this.name;
    }
  });

  /**
   * Node for a list of nodes.
   */
  var NodeList = klass(nodes, Node, {
    initialize: function NodeList() {
      Node.prototype.initialize.call(this);

      this.elements = [];
    },

    add: function(element) {
      this.elements.prepend(element);
    },

    getElements: function() {
      return this.elements;
    }
  });

  /**
   * Node for the entire program.
   */
  var Program = klass(nodes, NodeList, {
    initialize: function Program() {
      NodeList.prototype.initialize.call(this);
    }
  });

  /**
   * Node for a class declaration.
   */
  var ClassDeclaration = klass(nodes, Node, {
    initialize: function ClassDeclaration(className, parentClass, body) {
      Node.prototype.initialize.call(this);

      if (!body) {
        body = parentClass;
        parentClass = undefined;
      }

      this.className = className;
      this.parentClass = parentClass;
      this.body = body;

      // TODO(tjclifton): Need to get the constructor or make one.
    }
  });

  /**
   * Node for the body of a class, probably needed because of scoping issues.
   */
  var ClassBody = klass(nodes, nodes.NodeList, {
    initialize: function ClassBody() {
      NodeList.prototype.initialize.call(this);
    }
  });

  var ParseActions = {
    Program: {
      onParse: $.overload(function() {
        return new Program();
      }, function(sourceElement, program) {
        program.add(sourceElement);
        return program;
      })
    },

    ClassDeclaration: {
      onParse: $.overload(function(className, body) {
        return new ClassDeclaration(className, body);
      }, function(className, parentClass, body) {
        return new ClassDeclaration(className, parentClass, body);
      })
    },

    ClassBody: {
      onParse: function(classElement, classBody) {
        classBody = classBody || [];

        if (classElement) classBody.splice(0, 0, classElement);
        return classBody;
      }
    },

    StaticMethod: {
      onParse: function(functionDelcaration) {
        return {
          node: 'StaticMethod',
          functionDeclaration: functionDeclaration
        };
      }
    },

    Accessor: {
      onParse: function(type, variableDeclarationList) {
        return {
          node: 'Accessor',
          type: type,
          variableDeclarationList: variableDeclarationList
        };
      }
    },

    FunctionDeclaration: {
      onParse: function(name, parameters, body) {
        return {
          node: 'FunctionDeclaration',
          name: name,
          parameters: parameters,
          body: body
        };
      }
    },

    Closure: {
      onParse: function(parameters, body) {
        return {
          node: 'Closure',
          parameters: parameters,
          body: body
        };
      }
    },

    FunctionExpression: {
      onParse: $.overload(function(parameters, body) {
        return {
          node: 'FunctionExpression',
          parameters: parameters,
          body: body
        };
      }, function(name, parameters, body) {
        return {
          node: 'FunctionExpression',
          name: name,
          parameters: parameters,
          body: body
        };
      })
    },

    ClassExpression: {
      onParse: function(body) {
        return {
          node: 'ClassExpression',
          body: body
        };
      }
    },

    ParameterList: {
      onParse: function(parameter, parameterList) {
        parameterList = parameterList || {
          node: 'ParameterList',
          parameters: []
        };

        parameterList.parameters.splice(0, 0, parameter);
        return parameterList;
      }
    },

    AutoSetParam: {
      onParse: function(identifier) {
        return {
          node: 'AutoSetParam',
          identifier: identifier
        };
      }
    },

    DefaultArgument: {
      onParse: function(identifier, expression) {
        return {
          node: 'DefaultArgument',
          identifier: identifier,
          expression: expression
        };
      }
    },

    FunctionBody: {
      onParse: $.overload(function() {
        return {
          node: 'FunctionBody',
          sourceElements: []
        };
      }, function(sourceElement, functionBody) {
        functionBody.sourceElements.splice(0, 0, sourceElement);
        return functionBody;
      })
    },

    MemberIdentifier: {
      onParse: function(identifier) {
        return {
          node: 'MemberIdentifier',
          identifier: identifier
        }
      },
    },

    ArrayLiteral: {
      onParse: function(arrayElements) {
        return {
          node: 'ArrayLiteral',
          arrayElements: arrayElements
        };
      }
    },

    ArrayElementList: {
      onParse: function(arrayElement, arrayElementList) {
        arrayElementList = arrayElementList || {
          node: 'ArrayElementList',
          arrayElements: []
        };

        arrayElementList.arrayElements.splice(0, 0, arrayElement);
        return arrayElementList;
      }
    },

    ObjectLiteral: {
      onParse: function(properties) {
        return {
          node: 'ObjectLiteral',
          properties: properties
        };
      }
    },

    PropertyList: {
      onParse: $.overload(function(property) {
        return [property];
      }, function(property, delimiter, propertyList) {
        propertyList.splice(0, 0, property);
        return propertyList;
      })
    },

    Property: {
      onParse: function(name, expression) {
        return {
          node: 'Property',
          name: name,
          expression: expression
        };
      }
    },

    PropertyName: {
      onParse: function(value) {
        return {
          node: 'PropertyName',
          value: value
        };
      }
    },

    AssignmentExpression: {
      onParse: function(leftHandSide, rightHandSide) {
        return {
          node: 'AssignmentExpression',
          leftHandSide: leftHandSide,
          rightHandSide: rightHandSide
        };
      }
    },

    ConditionalExpression: {
      onParse: function(condition, trueExpresion, falseExpression) {
        return {
          node: 'ConditionalExpression',
          condition: condition,
          trueExpression: trueExpression,
          falseExpression: falseExpression
        };
      }
    },

    SimpleExpression: {
      onParse: function(additiveExpression, relativeOperator, expression) {
        if (!expression) return additiveExpression;

        return {
          node: 'SimpleExpression',
          additiveExpression: additiveExpression,
          relativeOperator: relativeOperator,
          expression: expression
        };
      }
    },

    AdditiveExpression: {
      onParse: function(term, multiplicativeOperator, expression) {
        if (!expression) return term;

        return {
          node: 'AdditiveExpression',
          term: term,
          multiplicativeOperator: multiplicativeOperator,
          expression: expression
        };
      }
    },

    Term: {
      onParse: function(unaryExpression, additiveExpression, expression) {
        if (!expression) return unaryExpression;

        return {
          node: 'Term',
          unaryExpression: unaryExpression,
          additiveExpression: additiveExpression,
          expression: expression
        };
      }
    },

    UnaryExpression: {
      onParse: $.overload(function(expression) {
        return expression;
      }, function(type, expression) {
        return {
          node: 'UnaryExpression',
          type: type,
          expression: expression
        };
      })
    },

    PostfixIncrementExpression: {
      onParse: function(leftHandSideExpression, type) {
        return {
          node: 'PostfixIncrementExpression',
          leftHandSideExpression: leftHandSideExpression,
          type: type
        };
      }
    },

    PrefixIncrementExpression: {
      onParse: function(type, leftHandSideExpression) {
        return {
          node: 'PrefixIncrementExpression',
          type: type,
          leftHandSideExpression: leftHandSideExpression
        };
      }
    },

    NewExpression: {
      onParse: function(leftHandSideExpression) {
        return {
          node: 'NewExpression',
          leftHandSideExpression: leftHandSideExpression
        };
      }
    },

    MemberExpression: {
      onParse: function(primaryExpression, memberPart) {
        if (memberPart) {
          memberPart.splice(0, 0, primaryExpression);

          return {
            node: 'MemberExpression',
            members: memberPart
          };
        }

        return primaryExpression;
      }
    },

    MemberPart: {
      onParse: function(member, memberPart) {
        var chain = memberPart || [member];
        if (memberPart) chain.splice(0, 0, member);

        return chain;
      }
    },

    PropertyAccess: {
      onParse: function(identifier) {
        return {
          node: 'PropertyAccess',
          identifier: identifier
        };
      }
    },

    BindExpression: {
      onParse: function(call) {
        return {
          node: 'BindExpression',
          arguments: call.arguments
        };
      }
    },

    ArrayDereference: {
      onParse: function(expression) {
        return {
          node: 'ArrayDereference',
          expression: expression
        };
      }
    },

    Call: {
      onParse: function(arguments) {
        return {
          node: 'Call',
          arguments: arguments
        };
      }
    },

    Arguments: {
      onParse: $.overload(function() {
        return [];
      }, function(argumentList) {
        return argumentList;
      })
    },

    ArgumentList: {
      onParse: $.overload(function(argument) {
        return [argument];
      }, function(argument, argumentList) {
        argumentList.splice(0, 0, argument);
        return argumentList;
      })
    },

    Operator: {
      onParse: function(type) {
        return {
          node: 'Operator',
          type: type
        };
      }
    },

    StatementList: {
      onParse: function(statement, statementList) {
        statementList = statementList || {
          node: 'StatementList',
          statements: []
        };

        statementList.statements.splice(0, 0, statement);
        return statementList;
      }
    },

    TerminatedStatement: {
      onParse: function(statement) {
        return {
          node: 'TerminatedStatement',
          statement: statement
        };
      }
    },

    // EndSt: {
    //   onParse: function(type) {
    //     return {
    //       node: 'EndSt',
    //       type: type
    //     };
    //   }
    // },

    VariableStatement: {
      onParse: function(variableDeclarationList) {
        return {
          node: 'VariableStatement',
          variableDeclarationList: variableDeclarationList
        };
      }
    },

    VariableDeclarationList: {
      onParse: function(variableDeclaration, variableDeclarationList) {
        variableDeclarationList = variableDeclarationList || {
          node: 'VariableDeclarationList',
          variableDeclarations: []
        };

        variableDeclarationList.variableDeclarations.splice(0, 0, variableDeclaration);
        return variableDeclarationList;
      }
    },

    VariableDeclaration: {
      onParse: function(identifier, expression) {
        return {
          node: 'VariableDeclaration',
          identifier: identifier,
          expression: expression
        };
      }
    },

    IfStatement: {
      onParse: function(condition, blockBody, elseIfPart, elsePart) {
        return {
          node: 'IfStatement',
          condition: condition,
          blockBody: blockBody,
          elseIfPart: elseIfPart,
          elsePart: elsePart
        };
      }
    },

    OneLineIfStatement: {
      onParse: function(statement, condition) {
        return {
          node: 'OneLineIfStatement',
          statement: statement,
          condition: condition
        };
      }
    },

    UnlessStatement: {
      onParse: function(condition, blockBody) {
        return {
          node: 'UnlessStatement',
          condition: condition,
          blockBody: blockBody
        };
      }
    },

    OneLineUnlessStatement: {
      onParse: function(statement, condition) {
        return {
          node: 'OneLineUnlessStatement',
          statement: statement,
          condition: condition
        };
      }
    },

    ElsePart: {
      onParse: function(blockBody) {
        return {
          node: 'ElsePart',
          blockBody: blockBody
        };
      }
    },

    ElseIfList: {
      onParse: function(elseIf, elseIfList) {
        elseIfList = elseIfList || {
          node: 'ElseIfList',
          elseIfs: []
        };

        elseIfList.elseIfs.splice(0, 0, elseIf);
        return elseIfList;
      }
    },

    ElseIf: {
      onParse: function(condition, blockBody) {
        return {
          node: 'ElseIf',
          condition: condition,
          blockBody: blockBody
        };
      }
    },

    WhileLoop: {
      onParse: function(condition, blockBody) {
        return {
          node: 'WhileLoop',
          condition: condition,
          blockBody: blockBody
        };
      }
    },

    UntilLoop: {
      onParse: function(condition, blockBody) {
        return {
          node: 'UntilLoop',
          condition: condition,
          blockBody: blockBody
        };
      }
    },

    DoWhileLoop: {
      onParse: function(blockBody, condition) {
        return {
          node: 'DoWhileLoop',
          blockBody: blockBody,
          condition: condition
        };
      }
    },

    DoUntilLoop: {
      onParse: function(blockBody, condition) {
        return {
          node: 'DoUntilLoop',
          blockBody: blockBody,
          condition: condition
        };
      }
    },

    ForLoop: {
      onParse: function(forLoopStructure, blockBody) {
        return {
          node: 'ForLoop',
          forLoopStructure: forLoopStructure,
          blockBody: blockBody
        };
      }
    },

    StandardForStructure: {
      onParse: function(initializer, condition, increment) {
        return {
          node: 'StandardForStructure',
          initializer: initializer,
          condition: condition,
          increment: increment
        };
      }
    },

    ForInStructure: {
      onParse: function(variable, value, index) {
        return {
          node: 'ForInStructure',
          variable: variable,
          value: value,
          index: index
        };
      }
    },

    MultipleForInStructure: {
      onParse: function(firstVariable, secondVariable, value, index) {
        return {
          node: 'MultipleForInStructure',
          firstVariable: firstVariable,
          secondVariable: secondVariable,
          value: value,
          index: index
        };
      }
    },

    InflectedForStructure: {
      onParse: function(value, index) {
        return {
          node: 'InflectedForStructure',
          value: value,
          index: index
        };
      }
    },

    ContinueStatement: {
      onParse: function(identifier) {
        return {
          node: 'ContinueStatement',
          identifier: identifier
        };
      }
    },

    BreakStatement: {
      onParse: function(identifier) {
        return {
          node: 'BreakStatement',
          identifier: identifier
        };
      }
    },

    ReturnStatement: {
      onParse: function(identifier) {
        return {
          node: 'ReturnStatement',
          identifier: identifier
        };
      }
    },

    WithStatement: {
      onParse: function(context, blockBody) {
        return {
          node: 'WithStatement',
          context: context,
          blockBody: blockBody
        };
      }
    },

    SwitchStatement: {
      onParse: function(expression, caseBlock) {
        return {
          node: 'SwitchStatement',
          expression: expression,
          caseBlock: caseBlock
        };
      }
    },

    CaseBlock: {
      onParse: function(firstSection, secondSection, thirdSection) {
        return {
          node: 'CaseBlock',
          firstSection: firstSection,
          secondSection: secondSection,
          thirdSection: thirdSection
        };
      }
    },

    CaseClauseList: {
      onParse: function(caseClause, caseClauseList) {
        caseClauseList = caseClauseList || {
          node: 'CaseClauseList',
          caseClauses: []
        };

        caseClauseList.caseClauses.splice(0, 0, caseClause);
        return caseClauseList;
      }
    },

    CaseClause: {
      onParse: function(expressionList, blockBody) {
        return {
          node: 'CaseClause',
          expressionList: expressionList,
          blockBody: blockBody
        };
      }
    },

    CaseExpressionList: {
      onParse: function(expression, expressionList) {
        expressionList = expressionList || {
          node: 'CaseExpressionList',
          expressions: []
        };

        expressionList.expressions.splice(0, 0, expression);
        return expressionList;
      }
    },

    DefaultClause: {
      onParse: function(blockBody) {
        return {
          node: 'DefaultClause',
          blockBody: blockBody
        };
      }
    },

    LabelledStatement: {
      onParse: function(identifier, value) {
        return {
          node: 'LabelledStatement',
          identifier: identifier,
          value: value
        };
      }
    },

    ThrowStatement: {
      onParse: function(expression) {
        return {
          node: 'ThrowStatement',
          expression: expression
        };
      }
    },

    TryStatement: {
      onParse: function(firstSection, secondSection, thirdSection) {
        return {
          node: 'TryStatement',
          firstSection: firstSection,
          secondSection: secondSection,
          thirdSection: thirdSection
        };
      }
    },

    Catch: {
      onParse: $.overload(function(blockBody) {
        return {
          node: 'Catch',
          blockBody: blockBody
        };
      }, function(identifier, blockBody) {
        return {
          node: 'Catch',
          identifier: identifier,
          blockBody: blockBody
        };
      })
    },

    Finally: {
      onParse: function(blockBody) {
        return {
          node: 'Finally',
          blockBody: blockBody
        };
      }
    },

    DebuggerStatement: {
      onParse: function() {
        return {
          node: 'DebuggerStatement'
        };
      }
    },
  };

  for (var className in ParseActions) {
    var methods = ParseActions[className];
    methods.template = Templates[className];
  }

  window.ParseActions = ParseActions;
}(jQuery);
