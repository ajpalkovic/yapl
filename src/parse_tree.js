!function($) {
  window.nodes = {};

  /**
   * Base node class.
   */
  var Node = klass(nodes, {}, {
    initialize: function Node() {
    },

    toString: function() {
      return this.constructor.name;
    },

    toJs: function(context) {
      context.getEmitter().e('<<"', this.constructor.name, '" has no toJs>>');
    }
  });

  /**
   * Node for a list of nodes.
   */
  var NodeList = klass(nodes, Node, {
    initialize: function NodeList() {
      Node.prototype.initialize.call(this);

      this.elements = Array.prototype.slice.call(arguments);
    },

    add: function(element) {
      this.elements.prepend(element);
    },

    toJs: function(context) {
      for (var i = 0; i < this.elements.length; ++i) {
        var element = this.elements[i];

        if (element.toJs) {
          element.toJs(context);
        } else {
          emitter.e(element);
        }
      }
    },

    getElements: function() {
      return this.elements;
    }
  });

  /**
   * List of nodes delimited by some delimiter.
   */
  var DelimitedNodeList = klass(nodes, NodeList, {
    initialize: function DelimitedNodeList() {
      this.delimiter = Array.prototype.shift.call(arguments);

      NodeList.prototype.initialize.apply(this, arguments);
    },

    toJs: function(context) {
      var elements = this.getElements();
      var emitter = context.getEmitter();

      for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];

        if (element.toJs) {
          element.toJs(context);
        } else {
          emitter.e(element);
        }

        if (i < elements.length - 1) emitter.e(this.delimiter);
      }
    }
  });

  var CommaNodeList = klass(nodes, DelimitedNodeList, {
    initialize: function CommaNodeList() {
      Array.prototype.splice.call(arguments, 0, 0, ', ');

      DelimitedNodeList.prototype.initialize.apply(this, arguments);
    }
  });

  var NewlineNodeList = klass(nodes, NodeList, {
    initialize: function NewlineNodeList() {
      NodeList.prototype.initialize.apply(this, arguments);
    },

    toJs: function(context) {
      var elements = this.getElements();
      var emitter = context.getEmitter();

      for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];

        if (element.toJs) {
          element.toJs(context);
        } else {
          emitter.e(element);
        }

        emitter.nl();
      }
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

      this.constructor = new FunctionDeclaration(this.className, new ParameterList(), new FunctionBody());
      this.methods = this.__extractAll(Method);
      this.instanceVars = this.__extractAll(VariableStatement);

      // Find the constructor if there is one.
      for (var i = 0; i < this.methods.length; ++i) {
        if (this.methods[i].name == this.className) {
          this.constructor = this.methods[i];
          break;
        }
      }
    },

    __extractAll: function(NodeType) {
      var elements = this.body.getElements();
      var extractedElements = new NewlineNodeList();

      for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];

        if (element instanceof NodeType) {
          extractedElements.add(element);
          elements.splice(i, 1);
          i--;
        }
      }

      return extractedElements;
    },

    getClassName: function() {
      return this.className;
    },

    toJs: function(context) {
      var emitter = context.getEmitter();
      var constructorDecl = VariableStatement.of(this.className, this.constructor);

      var classContext = context.subcontext();
      classContext.put(this.className);

      emitter.e('!function() {').nl().i();
      this.body.toJs(classContext);

      classContext.put('this', this);
      constructorDecl.toJs(classContext);
      this.methods.toJs(classContext);

      emitter.u().e('}();');
    }
  });

  /**
   * Node for the body of a class, probably needed because of scoping issues.
   */
  var ClassBody = klass(nodes, NewlineNodeList, {
    initialize: function ClassBody() {
      NewlineNodeList.prototype.initialize.call(this);
    }
  });

  /**
   * Node for a function declaration (within or outside of a class).
   */
  var FunctionDeclaration = klass(nodes, Node, {
    initialize: function FunctionDeclaration(name, parameters, body) {
      Node.prototype.initialize.call(this);

      this.name = name;
      this.parameters = parameters;
      this.body = body;
    },

    toJs: function(context) {
      var emitter = context.getEmitter();
      emitter.e('function ', this.name, '(', this.parameters.toJs.bind(this.parameters, context), ') {').nl().i();

      context.put(this.name.value, this);
      this.body.toJs(context.subcontext());

      emitter.u().nl().e('}');
    }
  });

  /**
   * Node for a function expression (not a declaration).
   */
  var FunctionExpression = klass(nodes, FunctionDeclaration, {
    initialize: function FunctionExpression(name, parameters, body) {
      if (!body) Array.prototype.splice.call(arguments, 0, 0, '');

      FunctionDeclaration.prototype.initialize.apply(this, arguments);
    }
  });

  /**
   * Node that represents a method of a class.
   */
  var Method = klass(nodes, Node, {
    initialize: function Method(name, parameters, body) {
      this.name = name;
      this.parameters = parameters;
      this.body = body;
    },

    toJs: function(context) {
      var emitter = context.getEmitter();
      var classDeclaration = context.lookup('this');
      var methodContext = context.subcontext();

      emitter.e(classDeclaration.getClassName(), '.prototype.', this.name, ' = function(');
      this.parameters.toJs(methodContext);
      emitter.e(') {').i().nl();

      methodContext.put(this.name.value);
      this.body.toJs(methodContext);

      emitter.u().nl().e('};');
    }
  });

  /**
   * Node for a method that won't be placed on the prototype of the
   * JS function, but on the function itself.
   */
  var StaticMethod = klass(nodes, Node, {
    initialize: function StaticMethod(method) {
      Node.prototype.initialize.call(this);

      this.method = method;
    }
  });

  /**
   * Node for an accessor/synthesizer for instance variables.
   */
  var Accessor = klass(nodes, Node, {
    initialize: function Accessor(type, variableDeclarationList) {
      Node.prototype.initialize.call(this);

      this.type = type;
      this.variableDeclarationList = variableDeclarationList;
    }
  });

  /**
   * Node for a closure, which is basically an anonymous function with
   * lexically scoped local varaibles.
   */
  var Closure = klass(nodes, FunctionExpression, {
    initialize: function Closure(parameters, body) {
      FunctionExpression.prototype.initialize.call(this, parameters, body);
    }
  });

  /**
   * Node list for a series of parameters for a function.
   */
  var ParameterList = klass(nodes, NodeList, {
    initialize: function ParameterList() {
      NodeList.prototype.initialize.apply(this, arguments);
    },

    toJs: function(context) {
      var elements = this.getElements();
      var emitter = context.getEmitter();

      for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];

        if (typeof element === 'object') {
          context.put(element.value);
        } else {
          element.toJs(context);
        }
      }
    }
  });

  /**
   * Node for a parameter that will automatically set the corresponding instance
   * variable of the same name to the value.
   */
  var AutoSetParam = klass(nodes, Node, {
    initialize: function AutoSetParam(name) {
      Node.prototype.initialize.call(this);

      this.name = name;
    }
  });

  /**
   * Node for a parameter that has a default value (thus is optional).
   */
  var DefaultArgument = klass(nodes, Node, {
    initialize: function DefaultArgument(name, value) {
      Node.prototype.initialize.call(this);

      this.name = name;
      this.value = value;
    }
  });

  /**
   * Node for the body of a function.
   */
  var FunctionBody = klass(nodes, NodeList, {
    initialize: function FunctionBody() {
      NodeList.prototype.initialize.call(this);
    }
  });

  /**
   * Node for an instance variable.
   */
  var MemberIdentifier = klass(nodes, NodeList, {
    initialize: function MemberIdentifier(name) {
      this.name = name;
    }
  });

  /**
   * Node for an array literal ([]).
   */
  var ArrayLiteral = klass(nodes, Node, {
    initialize: function ArrayLiteral(elementList) {
      Node.prototype.initialize.call(this);

      this.elementList = elementList;
    }
  });

  /**
   * Node for an object/hash literal ({}).
   */
  var ObjectLiteral = klass(nodes, Node, {
    initialize: function ObjectLiteral(properties) {
      Node.prototype.initialize.call(this);

      // TODO(tjclifton): yea so this shouldn't happen... make the
      //    grammar better so that we can just expect a blank list,
      //    not undefined...
      this.properties = properties || new PropertyList();
    }
  });

  /**
   * Node for a series of object properties.
   */
  var PropertyList = klass(nodes, NodeList, {
    initialize: function PropertyList(firstProperty) {
      NodeList.prototype.initialize.call(this, firstProperty);
    }
  });

  /**
   * Node that represents a property of an object.  Can either be a key-value
   * pair or a single value, representing a set.
   */
  var Property = klass(nodes, Node, {
    initialize: function Property(name, value) {
      Node.prototype.initialize.call(this);

      this.name = name;
      this.value = value;
    }
  });

  /**
   * Node that represents some expression with a binary operator.
   */
  var BinaryExpression = klass(nodes, Node, {
    initialize: function BinaryExpression(leftHandSide, operator, rightHandSide) {
      Node.prototype.initialize.call(this);

      this.leftHandSide = leftHandSide;
      this.operator = operator;
      this.rightHandSide = rightHandSide;
    }
  });

  /**
   * Node that represents an assignment.
   */
  var AssignmentExpression = klass(nodes, BinaryExpression, {
    initialize: function AssignmentExpression(receiver, value) {
      BinaryExpression.prototype.initialize.call(this, receiver, '=', value);
    }
  });

  /**
   * Node that represents a conditional/ternary expression.
   */
  var ConditionalExpression = klass(nodes, Node, {
    initialize: function ConditionalExpression(condition, trueValue, falseValue) {
      Node.prototype.initialize.call(this);

      this.condition = condition;
      this.trueValue = trueValue;
      this.falseValue = falseValue;
    }
  });

  /**
   * Node for a basic relative operator expression.
   */
  var SimpleExpression = klass(nodes, BinaryExpression, {
    initialize: function SimpleExpression(leftHandSide, operator, rightHandSide) {
      BinaryExpression.prototype.initialize.call(this, leftHandSide, operator, rightHandSide);
    }
  });

  /**
   * Node for an expression with an additive operator.
   */
  var AdditiveExpression = klass(nodes, BinaryExpression, {
    initialize: function AdditiveExpression(leftHandSide, operator, rightHandSide) {
      BinaryExpression.prototype.initialize.call(this, leftHandSide, operator, rightHandSide);
    }
  });

  /**
   * Node for a unary expression.
   */
  var UnaryExpression = klass(nodes, Node, {
    initialize: function UnaryExpression(operator, value) {
      Node.prototype.initialize.call(this);

      this.operator = operator;
      this.value = value;
    }
  });

  /**
   * Node for an increment expression with the incrementor/decrementor coming
   * before the value.
   */
  var PrefixIncrementExpression = klass(nodes, UnaryExpression, {
    initialize: function PrefixIncrementExpression(operator, value) {
      UnaryExpression.prototype.initialize.call(this, operator, value);
    }
  });

  /**
   * Node for an increment expression with the incrementor/decrementor coming after
   * the value.
   */
  var PostfixIncrementExpression = klass(nodes, Node, {
    initialize: function PostfixIncrementExpression(value, operator) {
      Node.prototype.initialize.call(this);

      this.operator = operator;
      this.value = value;
    }
  });

  /**
   * Node for an expression that creates a new object.
   */
  var NewExpression = klass(nodes, Node, {
    initialize: function NewExpression(value) {
      Node.prototype.initialize.call(this);

      this.value = value;
    }
  });

  /**
   * Node that represents some form of expression with chaining.
   */
  var MemberExpression = klass(nodes, Node, {
    initialize: function MemberExpression(memberChain) {
      Node.prototype.initialize.call(this);

      this.memberChain = memberChain;
    }
  });

  /**
   * Node that represents a chain of members.
   */
  var MemberPart = klass(nodes, NodeList, {
    initialize: function MemberPart(firstMember) {
      NodeList.prototype.initialize.call(this, firstMember);
    }
  });

  /**
   * Node for a property access on an object.
   */
  var PropertyAccess = klass(nodes, Node, {
    initialize: function PropertyAccess(name) {
      Node.prototype.initialize.call(this);

      this.name = name;
    }
  });

  /**
   * Node for a function call expression.
   */
  var Call = klass(nodes, Node, {
    initialize: function Call(arguments) {
      Node.prototype.initialize.call(this);

      this.arguments = arguments || new ArgumentList();
    }
  });

  /**
   * Node for an expression that binds the function to some scope with
   * curried arguments.
   */
  var BindExpression = klass(nodes, Call, {
    initialize: function BindExpression(arguments) {
      Call.prototype.initialize.call(this, arguments);
    }
  });

  /**
   * Node for an array dereference.
   */
  var ArrayDereference = klass(nodes, Node, {
    initialize: function ArrayDereference(index) {
      Node.prototype.initialize.call(this);

      this.index = index;
    }
  });

  /**
   * Node for a series of function arguments.
   */
  var ArgumentList = klass(nodes, CommaNodeList, {
    initialize: function ArgumentList(firstElement) {
      CommaNodeList.prototype.initialize.call(this, firstElement);
    }
  });

  /**
   * Node for any operator.
   */
  var Operator = klass(nodes, Node, {
    initialize: function Operator(value) {
      Node.prototype.initialize.call(this);

      this.value = value;
    }
  });

  /**
   * Node for any primitive JavaScript literal value.
   */
  var PrimitiveLiteralExpression = klass(nodes, Node, {
    initialize: function PrimitiveLiteralExpression(value) {
      Node.prototype.initialize.call(this);

      this.value = value;
    },

    toJs: function(context) {
      context.getEmitter().e(this.value);
    }
  });

  /**
   * Node for identifiers that are not in some type of declaration.
   */
  var Reference = klass(nodes, Node, {
    initialize: function Reference(name) {
      this.name = name;
    },

    toJs: function(context) {
      if (!context.lookup(this.name.value)) throw new errors.ReferenceError(this.name.line, this.name.value);

      context.getEmitter().e(this.name.value);
    }
  });

  /**
   * Node for a statement that ends in a statement-terminating character.
   */
  var TerminatedStatement = klass(nodes, Node, {
    initialize: function TerminatedStatement() {
      Node.prototype.initialize.call(this);
    },

    toJs: function(context) {
      context.getEmitter().e(';').nl();
    }
  });

  /**
   * Node for a statement that declares a variable.
   */
  var VariableStatement = klass(nodes, TerminatedStatement, {
    initialize: function VariableStatement(variableDeclarationList) {
      TerminatedStatement.prototype.initialize.call(this);

      this.variableDeclarationList = variableDeclarationList;
    },

    toJs: function(context) {
      context.getEmitter().e('var ', this.variableDeclarationList.toJs.bind(this.variableDeclarationList, context));

      TerminatedStatement.prototype.toJs.call(this, context);
    }
  });

  /**
   * Convenience function for creating a single variable assignment statement.
   */
  VariableStatement.of = function(name, value) {
    var decl = new VariableDeclaration(name, value);
    var list = new VariableDeclarationList(decl);

    return new VariableStatement(list);
  };

  /**
   * Node for a series of variable declarations in a variable statement.
   */
  var VariableDeclarationList = klass(nodes, CommaNodeList, {
    initialize: function VariableDeclarationList(firstVariable) {
      CommaNodeList.prototype.initialize.call(this, firstVariable);
    }
  });

  /**
   * Node that represents the original assignment of a variable.
   */
  var VariableDeclaration = klass(nodes, Node, {
    initialize: function VariableDeclaration(name, value) {
      Node.prototype.initialize.call(this);

      this.name = name;
      this.value = value;
    },

    toJs: function(context) {
      context.getEmitter().e(this.name, ' = ', this.value.toJs.bind(this.value, context));
      context.put(this.name);
    }
  });

  /**
   * Node that represents an if-statement.
   */
  var IfStatement = klass(nodes, Node, {
    initialize: function IfStatement() {
      Node.prototype.initialize.call(this);

      var args = Array.prototype.slice.call(arguments);

      this.condition = args.shift();
      this.ifBody = args.shift();
      this.elseIfList = args.shift();
      this.elseBody = args.shift();
    }
  });

  /**
   * Node that represents an if-statement that only takes up one line.
   */
  var OneLineIfStatement = klass(nodes, IfStatement, {
    initialize: function OneLineIfStatement(statement, condition) {
      IfStatement.prototype.initialize.call(this, condition, statement);
    }
  });

  /**
   * Node that represents a ruby-style unless control block.
   */
  var UnlessStatement = klass(nodes, IfStatement, {
    initialize: function UnlessStatement(condition, body) {
      var negatedCondition = new UnaryExpression('!', condition);
      IfStatement.prototype.initialize.call(this, negatedCondition, body);
    }
  });

  /**
   * Node that represents single-line unless statement.
   */
  var OneLineUnlessStatement = klass(nodes, UnlessStatement, {
    initialize: function OneLineUnlessStatement(statement, condition) {
      UnlessStatement.prototype.initialize.call(this, condition, statement);
    }
  });

  /**
   * Node that represents the else case of an if-statement.
   */
  var ElsePart = klass(nodes, Node, {
    initialize: function ElsePart(body) {
      Node.prototype.initialize.call(this);

      this.body = body;
    }
  });

  /**
   * Node that represents an else-if case of an if-statement.
   */
  var ElseIf = klass(nodes, Node, {
    initialize: function ElseIf(condition, body) {
      Node.prototype.initialize.call(this);

      this.condition = condition;
      this.body = body;
    }
  });

  /**
   * Node that represents a while-loop.
   */
  var WhileLoop = klass(nodes, Node, {
    initialize: function WhileLoop(condition, body) {
      Node.prototype.initialize.call(this);

      this.condition = condition;
      this.body = body;
    }
  });

  /**
   * Node that represents a while-loop with the condition negated.
   */
  var UntilLoop = klass(nodes, WhileLoop, {
    initialize: function UntilLoop(condition, body) {
      var negatedCondition = new UnaryExpression('!', condition);
      WhileLoop.prototype.initialize.call(this, negatedCondition, body);
    }
  });

  /**
   * Node that represents a for-loop with varying types of structure.
   */
  var ForLoop = klass(nodes, Node, {
    initialize: function ForLoop(structure, body) {
      Node.prototype.initialize.call(this);

      this.structure = structure;
      this.body = body;
    }
  });

  /**
   * Node that represents the traditional [initializer];[condition];[increment]
   */
  var StandardForStructure = klass(nodes, Node, {
    initialize: function StandardForStructure(initializer, condition, increment) {
      Node.prototype.initialize.call(this);

      this.initializer = initializer;
      this.condition = condition;
      this.increment = increment;
    }
  });

  /**
   * Node that represents the for-in structure: <decl> in <expr> [at <decl>]
   */
  var ForInStructure = klass(nodes, Node, {
    initialize: function ForInStructure(key, collection, index) {
      Node.prototype.initialize.call(this);

      this.key = key;
      this.collection = collection;
      this.index = index;
    }
  });

  /**
   * Node that represents the for-in structure: <decl>, <decl> in <expr> [at <decl>]
   */
  var MultipleForInStructure = klass(nodes, ForInStructure, {
    initialize: function MultipleForInStructure(key, value, collection, index) {
      ForInStructure.prototype.initialize.call(this, key, collection, index);

      this.value = value;
    }
  });

  /**
   * Node that represents the for structure: <expr-singular> AT <decl>
   */
  var InflectedForStructure = klass(nodes, ForInStructure, {
    initialize: function InflectedForStructure(value, index) {
      // TODO(tjclifton): we need to do the inflection here.
      ForInStructure.prototype.initialize.call(this, value, undefined, index);
    }
  });

  /**
   * Node that represents some statement that begins with a keyword followed by
   * an expression.
   */
  var KeywordStatement = klass(nodes, Node, {
    initialize: function KeywordStatement(keyword, value) {
      Node.prototype.initialize.call(this);

      this.keyword = keyword;
      this.value = value;
    }
  });

  /**
   * Node that represents the with-statement.
   */
  var WithStatement = klass(nodes, Node, {
    initialize: function WithStatement(context, body) {
      Node.prototype.initialize.call(this);

      this.context = context;
      this.body = body;
    }
  });

  /**
   * Node that represents the switch-case statement.
   */
  var SwitchStatement = klass(nodes, Node, {
    initialize: function SwitchStatement(value, cases) {
      Node.prototype.initialize.call(this);

      this.value = value;
      this.cases = cases;
    }
  });

  /**
   * Node that represents the cases in a switch statement.
   */
  var CaseBlock = klass(nodes, Node, {
    initialize: function CaseBlock(casesBefore, defaultClause, casesAfter) {
      Node.prototype.initialize.call(this);

      casesBefore.getElements().concat(casesAfter.getElements());

      this.cases = casesBefore;
      this.defaultClause = defaultClause;
    }
  });

  /**
   * Node that represents a case in a switch statement.
   */
  var Case = klass(nodes, Node, {
    initialize: function Case(expressions, body) {
      Node.prototype.initialize.call(this);

      this.expressions = expressions;
      this.body = body;
    }
  });

  /**
   * Node that represents the optional default case of the switch statement.
   */
  var OptDefaultCase = klass(nodes, Node, {
    initialize: function OptDefaultCase(defaultCase) {
      Node.prototype.initialize.call(this);

      this.defaultCase = defaultCase;
    }
  });

  /**
   * Node that represents the default case of the switch statement.
   */
  var DefaultCase = klass(nodes, Node, {
    initialize: function DefaultCase(body) {
      Node.prototype.initialize.call(this);

      this.body = body;
    }
  });

  /**
   * Node that represents a label statement.
   */
  var LabeledStatement = klass(nodes, Node, {
    initialize: function LabeledStatement(label, statement) {
      Node.prototype.initialize.call(this);

      this.label = label;
      this.statement = statement;
    }
  });

  /**
   * Node that represents a try-catch.
   */
  var TryStatement = klass(nodes, Node, {
    initialize: function TryStatement(body, catchBody, finallyBody) {
      Node.prototype.initialize.call(this);

      this.body = body;
      this.catchBody = catchBody;
      this.finallyBody = finallyBody;
    }
  });

  /**
   * Node that represents an optional catch block for a try.
   */
  var OptCatch = klass(nodes, Node, {
    initialize: function OptCatch(catchBody) {
      Node.prototype.initialize.call(this);

      this.catchBody = catchBody;
    }
  });

  /**
   * Node that represents an optional finally block for a try.
   */
  var OptFinally = klass(nodes, Node, {
    initialize: function OptFinally(finallyBody) {
      Node.prototype.initialize.call(this);

      this.finallyBody = finallyBody;
    }
  });

  /**
   * Node that represents the catch block of a try.
   */
  var Catch = klass(nodes, Node, {
    initialize: function Catch(exception, body) {
      Node.prototype.initialize.call(this);

      this.exception = exception;

      if (!body) {
        this.body = exception;
        this.exception = undefined;
      }
    }
  });

  /**
   * Node that represents the finally block of a try.
   */
  var Finally = klass(nodes, Node, {
    initialize: function Finally(body) {
      Node.prototype.initialize.call(this);

      this.body = body;
    }
  });
}(jQuery);
