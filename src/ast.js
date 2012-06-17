var Nodes = (function() {
  var Program = {
    initialize: function() {
      this.sourceElements = [];
    }
  };

  var ClassDeclaration = {
    initialize: $.overload(function(className, body) {
      this.initialize(className, undefined, body);
    }, function(className, parentClass, body) {
      this.className = className;
      this.parentClass = parentClass;
      this.body = body;
    });
  };

  var ClassBody = {
    initialize: function() {
      this.classElements = [];
    }
  };

  var StaticMethod = {
    initialize: function(functionDelcaration) {
      this.functionDeclaration = functionDeclaration;
    }
  };

  var Accessor = {
    initialize: function(type, variableDeclarationList) {
      this.type = type;
      this.variableDeclarationList = variableDeclarationList;
    }
  };

  var FunctionDeclaration = {
    initialize: function(name, parameters, body) {
      this.name = name;
      this.parameters = parameters;
      this.body;
    }
  };

  var Closure = {
    initialize: function(parameters, body) {
      this.parameters = parameters;
      this.body = body;
    }
  };

  var FunctionExpression = {
    initialize: $.overload(function(parameters, body) {
      this.initialize(undefined, parameters, body);
    }, function(name, parameters, body) {
      this.name = name;
      this.parameters = parameters;
      this.body = body;
    })
  };

  var ClassExpression = {
    initialize: function(body) {
      this.body = body;
    }
  };

  var Parameters = {
    initialize: function(parameterList) {
      this.parameterList = parameterList;
    }
  };

  var ParameterList = {
    initialize: function(parameter) {
      this.elements = [parameter];
    }
  };

  var AutoSetParam = {
    initialize: function(identifier) {
      this.identifier = identifier;
    }
  };

  var DefaultArgument = {
    initialize: function(identifier, expression) {
      this.identifier = identifier;
      this.expression = expression;
    }
  };

  var FunctionBody = {
    initialize: function() {
      this.sourceElements = [];
    }
  };

  var MemberIdentifier = {
    initialize: function(identifier) {
      this.identifier = identifier;
    };
  };

  var ArrayLiteral = {
    initialize: function(arrayElements) {
      this.arrayElements = arrayElements;
    }
  };

  var ArrayElements = {
    initialize: function(arrayElement) {
      this.arrayElements = [arrayElement];
    }
  };

  var ObjectLiteral = {
    initialize: function(properties) {
      this.properties = properties;
    }
  };

  var Properties = {
    initialize: function(property) {
      this.properties = [property];
    }
  };

  var Property = {
    initialize: $.overload(function(name) {
      this.initialize(name, undefined);
    }, function(name, expression) {
      this.name = name;
      this.expression = expression;
    })
  };

  var PropertyName = {
    initialize: function(value) {
      this.value = value;
    }
  };

  var ExpressionList = {
    initialize: function(expression) {
      this.elements = [expression];
    }
  };

  var AssignmentExpression = {
    initialize: function(leftHandSide, rightHandSide) {
      this.leftHandSide = leftHandSide;
      this.rightHandSide = rightHandSide;
    }
  };

  var ConditionalExpression = {
    initialize: function(condition, trueExpresion, falseExpression) {
      this.condition = condition;
      this.trueExpression = trueExpression;
      this.falseExpression = falseExpression;
    }
  };

  var SimpleExpression = {
    initialize: function(additiveExpression, relativeOperator, expression) {
      this.additiveExpression = additiveExpression;
      this.relativeOperator = relativeOperator;
      this.expression = expression;
    }
  };

  var AdditiveExpression = {
    initialize: function(term, multiplicativeOperator, expression) {
      this.term = term;
      this.multiplicativeOperator = multiplicativeOperator;
      this.expression = expression;
    }
  };

  var Term = {
    initialize: function(unaryExpression, additiveExpression, expression) {
      this.unaryExpression = unaryExpression;
      this.additiveExpression = additiveExpression;
      this.expression = expression;
    }
  };

  var UnaryExpression = {
    initialize: $.overload(function(expression) {
      this.initialize(undefined, expression);
    }, function(type, expression) {
      this.type = type;
      this.expression = expression;
    })
  };

  var PostfixIncrementExpression = {
    initialize: function(leftHandSideExpression, type) {
      this.leftHandSideExpression = leftHandSideExpression;
      this.type = type;
    }
  };

  var PrefixIncrementExpression = {
    initialize: function(type, leftHandSideExpression) {
      this.type = type;
      this.leftHandSideExpression = leftHandSideExpression;
    }
  };

  var NewExpression = {
    initialize: function(leftHandSideExpression) {
      this.leftHandSideExpression = leftHandSideExpression;
    }
  };

  var MemberExpression = {
    initialize: function(primaryExpression, memberPart) {
      this.primaryExpression = primaryExpression;
      this.memberPart = memberPart;
    }
  };

  var MemberPart = {
    initialize: function(member, memberPart) {
      this.member = member;
      this.memberPart = memberPart;
    }
  };

  var PropertyAccess = {
    initialize: function(identifier) {
      this.identifier = identifier;
    }
  };

  var BindExpression = {
    initialize: function(argumentList) {
      this.argumentList = argumentList;
    }
  };

  var ArrayDereference = {
    initialize: function(expression) {
      this.expression = expression;
    }
  };

  var Arguments = {
    initialize: function(argumentList) {
      this.argumentList = argumentList;
    }
  };

  var ArgumentList = {
    initialize: function(expression) {
      this.elements = [expression];
    }
  };

  var PrimaryExpression = {
    initialize: function(expression) {
      this.expression = expression;
    }
  };

  var NestedExpression = {
    initialize: function(expression) {
      this.expression = expression;
    }
  };

  var Operator = {
    initialize: function(type) {
      this.type = type;
    }
  };

  var StatementList = {
    initialize: function(statement) {
      this.elements = [statement];
    }
  };

  var TerminatedStatement = {
    initialize: function(statement) {
      this.statement = statement;
    }
  };

  var VariableStatement = {
    initialize: function(variableDeclarationList) {
      this.variableDeclarationList = variableDeclarationList;
    }
  };

  var VariableDeclarationList = {
    initialize: function(variableDeclaration) {
      this.elements = [variableDeclaration];
    }
  };

  var VariableDeclaration = {
    initialize: function(identifier, expression) {
      this.identifier = identifier;
      this.expression = expression;
    }
  };

  var IfStatement = {
    initialize: function(expression, blockBody, elseIfPart, elsePart) {
      this.expression = expression;
      this.blockBody = blockBody;
      this.elseIfPart = elseIfPart;
      this.elsePart = elsePart;
    }
  };

  var OneLineIfStatement = {
    initialize: function(simpleStatement, condition) {
      this.simpleStatement = simpleStatement;
      this.condition = condition;
    }
  };

  var UnlessStatement = {
    initialize: function(expression, blockBody) {
      this.expression = expression;
      this.blockBody = blockBody;
    }
  };

  var OneLineUnlessStatement = {
    initialize: function(simpleStatement, condition) {
      this.simpleStatement = simpleStatement;
      this.condition = condition;
    }
  };

  var ElsePart = {
    initialize: function(blockBody) {
      this.blockBody = blockBody;
    }
  };

  var ElseIfList = {
    initialize: function(elseIf) {
      this.elements = [elseIf];
    }
  };
})();
