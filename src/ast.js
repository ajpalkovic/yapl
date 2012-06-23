var Nodes = (function() {
  var classes = {
    Program: {
      initialize: function() {
        this.sourceElements = [];
      }
    },

    ClassDeclaration: {
      initialize: $.overload(function(className, body) {
        this.initialize(className, undefined, body);
      }, function(className, parentClass, body) {
        this.className = className;
        this.parentClass = parentClass;
        this.body = body;
      });
    },

    ClassBody: {
      initialize: function() {
        this.classElements = [];
      }
    },

    StaticMethod: {
      initialize: function(functionDelcaration) {
        this.functionDeclaration = functionDeclaration;
      }
    },

    Accessor: {
      initialize: function(type, variableDeclarationList) {
        this.type = type;
        this.variableDeclarationList = variableDeclarationList;
      }
    },

    FunctionDeclaration: {
      initialize: function(name, parameters, body) {
        this.name = name;
        this.parameters = parameters;
        this.body;
      }
    },

    Closure: {
      initialize: function(parameters, body) {
        this.parameters = parameters;
        this.body = body;
      }
    },

    FunctionExpression: {
      initialize: $.overload(function(parameters, body) {
        this.initialize(undefined, parameters, body);
      }, function(name, parameters, body) {
        this.name = name;
        this.parameters = parameters;
        this.body = body;
      })
    },

    ClassExpression: {
      initialize: function(body) {
        this.body = body;
      }
    },

    Parameters: {
      initialize: function(parameterList) {
        this.parameterList = parameterList;
      }
    },

    ParameterList: {
      initialize: function(parameter) {
        this.elements = [parameter];
      }
    },

    AutoSetParam: {
      initialize: function(identifier) {
        this.identifier = identifier;
      }
    },

    DefaultArgument: {
      initialize: function(identifier, expression) {
        this.identifier = identifier;
        this.expression = expression;
      }
    },

    FunctionBody: {
      initialize: function() {
        this.sourceElements = [];
      }
    },

    MemberIdentifier: {
      initialize: function(identifier) {
        this.identifier = identifier;
      },
    },

    ArrayLiteral: {
      initialize: function(arrayElements) {
        this.arrayElements = arrayElements;
      }
    },

    ArrayElements: {
      initialize: function(arrayElement) {
        this.arrayElements = [arrayElement];
      }
    },

    ObjectLiteral: {
      initialize: function(properties) {
        this.properties = properties;
      }
    },

    Properties: {
      initialize: function(property) {
        this.properties = [property];
      }
    },

    Property: {
      initialize: function(name, expression) {
        this.name = name;
        this.expression = expression;
      }
    },

    PropertyName: {
      initialize: function(value) {
        this.value = value;
      }
    },

    ExpressionList: {
      initialize: function(expression) {
        this.elements = [expression];
      }
    },

    AssignmentExpression: {
      initialize: function(leftHandSide, rightHandSide) {
        this.leftHandSide = leftHandSide;
        this.rightHandSide = rightHandSide;
      }
    },

    ConditionalExpression: {
      initialize: function(condition, trueExpresion, falseExpression) {
        this.condition = condition;
        this.trueExpression = trueExpression;
        this.falseExpression = falseExpression;
      }
    },

    SimpleExpression: {
      initialize: function(additiveExpression, relativeOperator, expression) {
        this.additiveExpression = additiveExpression;
        this.relativeOperator = relativeOperator;
        this.expression = expression;
      }
    },

    AdditiveExpression: {
      initialize: function(term, multiplicativeOperator, expression) {
        this.term = term;
        this.multiplicativeOperator = multiplicativeOperator;
        this.expression = expression;
      }
    },

    Term: {
      initialize: function(unaryExpression, additiveExpression, expression) {
        this.unaryExpression = unaryExpression;
        this.additiveExpression = additiveExpression;
        this.expression = expression;
      }
    },

    UnaryExpression: {
      initialize: $.overload(function(expression) {
        this.initialize(undefined, expression);
      }, function(type, expression) {
        this.type = type;
        this.expression = expression;
      })
    },

    PostfixIncrementExpression: {
      initialize: function(leftHandSideExpression, type) {
        this.leftHandSideExpression = leftHandSideExpression;
        this.type = type;
      }
    },

    PrefixIncrementExpression: {
      initialize: function(type, leftHandSideExpression) {
        this.type = type;
        this.leftHandSideExpression = leftHandSideExpression;
      }
    },

    NewExpression: {
      initialize: function(leftHandSideExpression) {
        this.leftHandSideExpression = leftHandSideExpression;
      }
    },

    MemberExpression: {
      initialize: function(primaryExpression, memberPart) {
        this.primaryExpression = primaryExpression;
        this.memberPart = memberPart;
      }
    },

    MemberPart: {
      initialize: function(member, memberPart) {
        this.member = member;
        this.memberPart = memberPart;
      }
    },

    PropertyAccess: {
      initialize: function(identifier) {
        this.identifier = identifier;
      }
    },

    BindExpression: {
      initialize: function(argumentList) {
        this.argumentList = argumentList;
      }
    },

    ArrayDereference: {
      initialize: function(expression) {
        this.expression = expression;
      }
    },

    Arguments: {
      initialize: function(argumentList) {
        this.argumentList = argumentList;
      }
    },

    ArgumentList: {
      initialize: function(expression) {
        this.elements = [expression];
      }
    },

    PrimaryExpression: {
      initialize: function(expression) {
        this.expression = expression;
      }
    },

    NestedExpression: {
      initialize: function(expression) {
        this.expression = expression;
      }
    },

    Operator: {
      initialize: function(type) {
        this.type = type;
      }
    },

    StatementList: {
      initialize: function(statement) {
        this.elements = [statement];
      }
    },

    TerminatedStatement: {
      initialize: function(statement) {
        this.statement = statement;
      }
    },

    VariableStatement: {
      initialize: function(variableDeclarationList) {
        this.variableDeclarationList = variableDeclarationList;
      }
    },

    VariableDeclarationList: {
      initialize: function(variableDeclaration) {
        this.elements = [variableDeclaration];
      }
    },

    VariableDeclaration: {
      initialize: function(identifier, expression) {
        this.identifier = identifier;
        this.expression = expression;
      }
    },

    IfStatement: {
      initialize: function(expression, blockBody, elseIfPart, elsePart) {
        this.expression = expression;
        this.blockBody = blockBody;
        this.elseIfPart = elseIfPart;
        this.elsePart = elsePart;
      }
    },

    OneLineIfStatement: {
      initialize: function(simpleStatement, condition) {
        this.simpleStatement = simpleStatement;
        this.condition = condition;
      }
    },

    UnlessStatement: {
      initialize: function(expression, blockBody) {
        this.expression = expression;
        this.blockBody = blockBody;
      }
    },

    OneLineUnlessStatement: {
      initialize: function(simpleStatement, condition) {
        this.simpleStatement = simpleStatement;
        this.condition = condition;
      }
    },

    ElsePart: {
      initialize: function(blockBody) {
        this.blockBody = blockBody;
      }
    },

    ElseIfList: {
      initialize: function(elseIf) {
        this.elements = [elseIf];
      }
    },

    ElseIf: {
      initialize: function(condition, blockBody) {
        this.condition = condition;
        this.blockBody = blockBody;
      }
    },

    WhileLoop: {
      initialize: function(condition, blockBody) {
        this.condition = condition;
        this.blockBody = blockBody;
      }
    },

    UntilLoop: {
      initialize: function(condition, blockBody) {
        this.condition = condition;
        this.blockBody = blockBody;
      }
    },

    DoWhileLoop: {
      initialize: function(blockBody, condition) {
        this.blockBody = blockBody;
        this.condition = condition;
      }
    },

    DoUntilLoop: {
      initialize: function(blockBody, condition) {
        this.blockBody = blockBody;
        this.condition = condition;
      }
    },

    ForLoop: {
      initialize: function(forLoopStructure, blockBody) {
        this.forLoopStructure = forLoopStructure;
        this.blockBody = blockBody;
      }
    },

    StandardForStructure: {
      initialize: function(initializer, condition, increment) {
        this.initializer = initializer;
        this.condition = condition;
        this.increment = increment;
      }
    },

    ForInstructure: {
      initialize: function(variable, value, index) {
        this.variable = variable;
        this.value = value;
        this.index = index;
      }
    },

    MultipleForInStructure: {
      initialize: function(firstVariable, secondVariable, value, index) {
        this.firstVariable = firstVariable;
        this.secondVariable = secondVariable;
        this.value = value;
        this.index = index;
      }
    },

    InflectedForStructure: {
      initialize: function(value, index) {
        this.value = value;
        this.index = index;
      }
    },

    ContinueStatement: {
      initialize: function(identifier) {
        this.identifier = identifier;
      }
    },

    BreakStatement: {
      initialize: function(identifier) {
        this.identifier = identifier;
      }
    },

    ReturnStatement: {
      initialize: function(identifier) {
        this.identifier = identifier;
      }
    },

    WithStatement: {
      initialize: function(context, blockBody) {
        this.context = context;
        this.blockBody = blockBody;
      }
    },

    SwitchStatement: {
      initialize: function(expression, caseBlock) {
        this.expression = expression;
        this.caseBlock = caseBlock;
      }
    },

    CaseBlock: {
      initialize: function(firstSection, secondSection, thirdSection) {
        this.firstSection = firstSection;
        this.secondSection = secondSection;
        this.thirdSection = thirdSection;
      }
    },

    CaseClauses: {
      initialize: function(caseClause) {
        this.elements = [causeClause];
      }
    },

    CaseClause: {
      initialize: function(expressionList, blockBody) {
        this.expressionList = expressionList;
        this.blockBody = blockBody;
      }
    },

    DefaultClause: {
      initialize: function(blockBody) {
        this.blockBody = blockBody;
      }
    },

    LabelledStatement: {
      initialize: function(identifier, value) {
        this.identifier = identifier;
        this.value = value;
      }
    },

    ThrowStatement: {
      initialize: function(expression) {
        this.expression = expression;
      }
    },

    TryStatement: {
      initialize: function(firstSection, secondSection, thirdSection) {
        this.firstSection = firstSection;
        this.secondSection = secondSection;
        this.thirdSection = thirdSection;
      }
    },

    Catch: {
      initialize: $.overload(function(blockBody) {
        this.initialize(undefined, identifier);
      }, function(identifier, blockBody) {
        this.identifier = identifier;
        this.blockBody = blockBody;
      })
    },

    Finally: {
      initialize: function(blockBody) {
        this.blockBody = blockBody;
      }
    },

    DebuggerStatement: {
      initialize: function() {
        
      }
    },
  };
})();
