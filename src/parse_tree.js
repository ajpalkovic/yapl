!function($) {
  window.nodes = {};

  var THIS = 'this';
  var METHOD = '<<method>>';
  var CLASS = '<<class>>';

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
      context.e('<<"', this.constructor.name, '" has no toJs>>');
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

    getElements: function() {
      return this.elements;
    },

    toJs: function(context) {
      for (var i = 0; i < this.elements.length; ++i) {
        var element = this.elements[i];

        context.e(element);
      }
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

      for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];

        context.e(element);

        if (i < elements.length - 1) context.e(this.delimiter);
      }
    }
  });

  /**
   * List of nodes delimited by a comma.
   */
  var CommaNodeList = klass(nodes, DelimitedNodeList, {
    initialize: function CommaNodeList() {
      Array.prototype.splice.call(arguments, 0, 0, ', ');

      DelimitedNodeList.prototype.initialize.apply(this, arguments);
    }
  });

  /**
   * List of nodes delimited by a newline.
   */
  var NewlineNodeList = klass(nodes, NodeList, {
    initialize: function NewlineNodeList() {
      NodeList.prototype.initialize.apply(this, arguments);
    },

    toJs: function(context) {
      var elements = this.getElements();

      for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];

        context.e(element);

        if (i < elements.length - 1) context.e().nl();
      }
    }
  });

  /**
   * Node class for any node that is 'callable'.
   */
  var Callable = klass(nodes, Node, {
    initialize: function Callable(name, parameters, body) {
      Node.prototype.initialize.call(this);

      this.name = name;
      this.parameters = parameters;
      this.body = body;
    }
  });

  /**
   * Node for the entire program.
   */
  var Program = klass(nodes, NewlineNodeList, {
    initialize: function Program() {
      NewlineNodeList.prototype.initialize.call(this);
    }
  });

  /**
   * Node for a class declaration.
   */
  var ClassDeclaration = klass(nodes, Node, {
    initialize: function ClassDeclaration(name, parentClass, body) {
      Node.prototype.initialize.call(this);

      if (!body) {
        body = parentClass;
        parentClass = undefined;
      }

      this.name = name;
      this.parentClass = parentClass;
      this.body = body;

      this.constructor = TerminatedStatement.of(
        new FunctionDeclaration(this.name, new ParameterList(), new FunctionBody()));

      this.methods = this.__extractAll(Method);
      this.staticMethods = this.__extractAll(StaticMethod);
      this.instanceVars = this.__extractAll(VariableStatement);

      // Find the constructor if there is one.
      var elements = this.methods.getElements();

      for (var i = 0; i < elements.length; ++i) {
        if (elements[i].name.value === this.name.value) {
          var constructorMethod = elements.splice(i, 1)[0];

          this.constructor.statement.parameters = constructorMethod.parameters;
          this.constructor.statement.body = constructorMethod.body;

          break;
        }
      }
    },

    __extractAll: function(NodeType) {
      var elements = this.body.getElements();
      var extractedElements = new ClassBody();

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

    toJs: function(context) {
      var thisProperty = new PropertyAccess('this', this.name);
      var constructorDecl = new AssignmentExpression(thisProperty, Operator.make('='), this.constructor);

      // TODO(tjclifton): need to get three separate bodies into one, but w/ same order.
      context.e('!function() {').blk()
        .e(this.body.toJs.bind(this.body, this))
        .e(constructorDecl).nl()
        .e(this.methods.toJs.bind(this.methods, this))
        .e(this.staticMethods.toJs.bind(this.staticMethods, this))
      .end().e('}();');
    }
  });

  /**
   * Node for the body of a class, probably needed because of scoping issues.
   */
  var ClassBody = klass(nodes, NodeList, {
    initialize: function ClassBody() {
      NodeList.prototype.initialize.call(this);
    },

    toJs: function(classDeclaration, context) {
      var elements = this.getElements();

      for (var i = 0; i < elements.length; ++i) {
        elements[i].toJs(classDeclaration, context);

        if (i < elements.length - 1) context.e().nl();
      }
    }
  });

  /**
   * Node for a function declaration (within or outside of a class).
   */
  var FunctionDeclaration = klass(nodes, Callable, {
    initialize: function FunctionDeclaration(name, parameters, body) {
      Callable.prototype.initialize.call(this, name, parameters, body);
    },

    toJs: function(context) {
      context.e('function ', this.name, '(', this.parameters, ') {').blk()
        .e(this.body)
      .end().e('}');
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
  var Method = klass(nodes, Callable, {
    initialize: function Method(name, parameters, body) {
      Callable.prototype.initialize.call(this, name, parameters, body);
    },

    toJs: function(classDeclaration, context) {
      context.e(classDeclaration.name,'.prototype.', this.name, ' = function(', this.parameters, ') {').blk()
        .e(this.body)
      .end().e('};');
    }
  });

  /**
   * Node for a method that won't be placed on the prototype of the
   * JS function, but on the function itself.
   */
  var StaticMethod = klass(nodes, Callable, {
    initialize: function StaticMethod(method) {
      Callable.prototype.initialize.call(this);

      this.method = method;
    },

    toJs: function(classDeclaration, context) {
      var name = this.method.name;
      var parameters = this.method.parameters;
      var body = this.method.body;


      context.e(classDeclaration.name, '.', name, ' = function(', parameters, ') {').blk()
        .e(body)
      .end().e('};');
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

      for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];

        context.e(element);
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
  var FunctionBody = klass(nodes, NewlineNodeList, {
    initialize: function FunctionBody() {
      NewlineNodeList.prototype.initialize.call(this);
    }
  });

  /**
   * Node for an instance variable.
   */
  var MemberIdentifier = klass(nodes, NodeList, {
    initialize: function MemberIdentifier(name) {
      this.name = name;
    },

    toJs: function(context) {
      context.e('this.', this.name);
    }
  });

  /**
   * Node for an array literal ([]).
   */
  var ArrayLiteral = klass(nodes, Node, {
    initialize: function ArrayLiteral(elementList) {
      Node.prototype.initialize.call(this);

      this.elementList = elementList;
    },

    toJs: function(context) {
      context.e('[', this.elementList, ']');
    }
  });

  /**
   * Node for an object/hash literal ({}).
   */
  var ObjectLiteral = klass(nodes, Node, {
    initialize: function ObjectLiteral(properties) {
      Node.prototype.initialize.call(this);

      this.properties = properties;
    },

    toJs: function(context) {
      context.e('{').blk()
        .e(this.properties)
      .end().e('}');
    }
  });

  /**
   * Node for a series of object properties.
   */
  var PropertyList = klass(nodes, NodeList, {
    initialize: function PropertyList(firstProperty) {
      NodeList.prototype.initialize.call(this, firstProperty);
    },

    toJs: function(context) {
      var elements = this.getElements();

      for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];

        element.toJs(context);

        if (i < elements.length - 1) context.e(',').nl();
      }
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
    },

    toJs: function(context) {
      context.e(this.name, ':', this.value || 'true');
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
    },

    toJs: function(context) {
      function makePow() {
        var powFunction = new PropertyAccess('Math', 'pow');
        var arguments = new ArgumentList(this.rightHandSide);
        arguments.add(this.leftHandSide);

        return new Call(powFunction, arguments);
      }

      var mappingFunctions = {
        COMPARE_TO: function() {
          var lessThan = new SimpleExpression(this.leftHandSide, Operator.make('<'), this.rightHandSide);
          var greaterThan = new SimpleExpression(this.leftHandSide, Operator.make('>'), this.rightHandSide);
          var innerConditional = new ConditionalExpression(lessThan, '-1', '0');
          var outerConditional = new ConditionalExpression(greaterThan, '1', innerConditional);

          return outerConditional;
        },

        CONDITIONAL_EQUALS: function() {
          var orNode = new SimpleExpression(this.leftHandSide, Operator.make('||'), this.rightHandSide);
          var assignment = new AssignmentExpression(this.leftHandSide, Operator.make('='), orNode);

          return assignment;
        },

        EXPONENTIATION_EQUALS: function() {
          var assignment = new AssignmentExpression(this.leftHandSide, Operator.make('='), makePow.call(this));

          return assignment;
        },

        EXPONENTIATION: function() {
          return makePow.call(this);
        }
      };

      var mappingFn = mappingFunctions[this.operator.token.type];

      if (mappingFn) {
        context.e(mappingFn.call(this));
      } else {
        context.e(this.leftHandSide, ' ', this.operator, ' ', this.rightHandSide);
      }
    }
  });

  /**
   * Node that represents an assignment.
   */
  var AssignmentExpression = klass(nodes, BinaryExpression, {
    initialize: function AssignmentExpression(receiver, operator, value) {
      BinaryExpression.prototype.initialize.call(this, receiver, operator, value);
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
    },

    toJs: function(context) {
      context.e(this.condition, ' ? ', this.trueValue, ' : ', this.falseValue);
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
   * Node for an expression with an multiplicative operator.
   */
  var AdditiveExpression = klass(nodes, BinaryExpression, {
    initialize: function AdditiveExpression(leftHandSide, operator, rightHandSide) {
      BinaryExpression.prototype.initialize.call(this, leftHandSide, operator, rightHandSide);
    }
  });

  /**
   * Node for an expression with an additive operator.
   */
  var Term = klass(nodes, BinaryExpression, {
    initialize: function Term(leftHandSide, operator, rightHandSide) {
      BinaryExpression.prototype.initialize.call(this, leftHandSide, operator, rightHandSide);
    }
  });

  /**
   * Node for an expression that is raised to some other expression.
   */
  var ExponentiationExpression = klass(nodes, BinaryExpression, {
    initialize: function ExponentiationExpression(leftHandSide, rightHandSide) {
      BinaryExpression.prototype.initialize.call(this, leftHandSide, Operator.make('**'), rightHandSide);
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
    },

    toJs: function(context) {
      context.e(this.operator, this.value);
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
    },

    toJs: function(context) {
      context.e(this.value, this.operator);
    }
  });

  /**
   * Node for an expression that creates a new object.
   */
  var NewExpression = klass(nodes, Node, {
    initialize: function NewExpression(value) {
      Node.prototype.initialize.call(this);

      this.value = value;
    },

    toJs: function(context) {
      context.e('new ', this.value);
    }
  });

  /**
   * Chain of members that is used to store the members before they are put in a
   * tree.
   */
  var MemberChain = klass(nodes, NodeList, {
    initialize: function MemberChain(member) {
      NodeList.prototype.initialize.call(this, member);
    }
  });

  /**
   * Node for an expression that is a series of chained/compounded operations on members
   * of the chain itself.
   */
  var CompoundExpression = klass(nodes, Node, {
    initialize: function Member(member, memberPart) {
      if (!memberPart) {
        memberPart = member;
        member = undefined;
      }

      this.member = member;
      this.memberPart = memberPart;
    }
  });

  /**
   * Node for a property access on an object.
   */
  var PropertyAccess = klass(nodes, CompoundExpression, {
    initialize: function PropertyAccess(member, name) {
      CompoundExpression.prototype.initialize.call(this, member, name);
    },

    toJs: function(context) {
      context.e(this.member, '.', this.memberPart);
    },
  });

  /**
   * Node for a function call expression.
   */
  var Call = klass(nodes, CompoundExpression, {
    initialize: function Call(member, args) {
      CompoundExpression.prototype.initialize.call(this, member, args);
    },

    toJs: function(context) {
      context.e(this.member, '(', this.memberPart, ')');
    }
  });

  /**
   * Node for loading a series of property lookups "safely" i.e., short circuiting to false
   * if one of the properties in the chain is undefined.
   */
  var ConditionalLoad = klass(nodes, CompoundExpression, {
    initialize: function ConditionalLoad(member, propertyName) {
      CompoundExpression.prototype.initialize.call(this, member, propertyName);
    },

    safeLoad: function() {
      var nonConditionalLoad = undefined;
      var validPropertyAccess = undefined;

      // If we have more safe loads to do (chained conditional loads)
      if (this.member.safeLoad) {
        // We recursively safe load the previous conditional load
        nonConditionalLoad = this.member.safeLoad();

        // And we know that the right hand side of the safe load is our
        // valid property access upon which we can tack another property load
        // without error.
        //
        //   nonConditionalLoad
        //     |--------|
        // eg. (a && a.b) && a.b.c
        //           |--|    |--|
        //         validPropertyAccess
        validPropertyAccess = nonConditionalLoad.rightHandSide;
      } else {
        // In the base case, where there are no more loads to recursively perform,
        // our non-conditional load and valid property access are one and the same.
        //
        //   nonConditionalLoad
        //     |
        // eg. a && a.b
        //          |
        //        validPropertyAccess
        nonConditionalLoad = this.member;
        validPropertyAccess = this.member;
      }

      console.log(this.memberPart);

      // Now make a new valid property access with the old valid property access as the
      // property accesses upon which we tack our next property load.
      validPropertyAccess = new PropertyAccess(validPropertyAccess, this.memberPart);
      // And we create a new 'check' that is evaluated at runtime and will short circuit if
      // the last property in nonConditional load does not exist.
      nonConditionalLoad = new SimpleExpression(nonConditionalLoad, Operator.make('&&'), validPropertyAccess);

      return nonConditionalLoad;
    },

    toJs: function(context) {
      context.e(this.safeLoad());
    }
  });

  /**
   * Node for an expression that binds the function to some scope with
   * curried arguments.
   */
  var BindExpression = klass(nodes, CompoundExpression, {
    initialize: function BindExpression(member, args) {
      CompoundExpression.prototype.initialize.call(this, member, args);
    },

    toJs: function(context) {
      context.e(this.member, '.bind', this.memberPart);
    }
  });

  /**
   * Node for an array dereference.
   */
  var ArrayDereference = klass(nodes, CompoundExpression, {
    initialize: function ArrayDereference(member, index) {
      CompoundExpression.prototype.initialize.call(this, member, index);
    },

    toJs: function(context) {
      context.e(this.member, '[', this.memberPart, ']');
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
    initialize: function Operator(token) {
      Node.prototype.initialize.call(this);

      this.token = token;
    },

    toJs: function(context) {
      context.e(this.token.value);
    }
  });

  Operator.tokenCache = {
    '+': new Operator({
      type: 'PLUS',
      value: '+'
    }),

    '-': new Operator({
      type: 'MINUS',
      value: '-'
    })
  };

  Operator.make = function(value) {
    if (!Operator.tokenCache[value]) {
      Operator.tokenCache[value] = new Operator(Tokens.types[value]());
    }

    return Operator.tokenCache[value];
  };

  /**
   * Node for any primitive JavaScript literal value.
   */
  var PrimitiveLiteralExpression = klass(nodes, Node, {
    initialize: function PrimitiveLiteralExpression(value) {
      Node.prototype.initialize.call(this);

      this.value = value;
    },

    toJs: function(context) {
      context.e(this.value);
    }
  });

  /**
   * Node for an expression surrounded by parentheses.
   */
  var NestedExpression = klass(nodes, Node, {
    initialize: function NestedExpression(expression) {
      Node.prototype.initialize.call(this);

      this.expression = expression;
    },

    toJs: function(context) {
      context.e('(', this.expression, ')');
    }
  });

  /**
   * Node for identifiers that are not in some type of declaration.
   */
  var Reference = klass(nodes, Node, {
    initialize: function Reference(name) {
      Node.prototype.initialize.call(this);

      this.name = name;
    },

    getName: function() {
      return this.name
    },

    toJs: function(context) {
      context.e(this.name);
    }
  });

  /**
   * Node for identifiers that are primary expressions that need to be converted to
   * call expressions if necessary.
   */
  var IdentifierReference = klass(nodes, Reference, {
    initialize: function IdentifierReference(name) {
      Reference.prototype.initialize.call(this, name);
    },

    toJs: function(context) {
      Reference.prototype.toJs.call(this, context);

      // var node = context.lookup(this.name);
      // if (node instanceof Callable) {
      //   var chain = new MemberPart(new Call(new NodeList()));
      //   chain.add(node.name);
      //   chain.toJs(context);
      // } else {
      //   context.getEmitter().e(this.name);
      // }
    }
  });

  /**
   * Node that encompasses a first-class use of a function by its name.
   */
  var FunctionReference = klass(nodes, Reference, {
    initialize: function FunctionReference(name) {
      Reference.prototype.initialize.call(this, name);
    },

    toJs: function(context) {
      Reference.prototype.toJs.call(this, context);
    }
  });

  /**
   * Node for a statement that ends in a statement-terminating character.
   */
  var TerminatedStatement = klass(nodes, Node, {
    initialize: function TerminatedStatement(statement) {
      Node.prototype.initialize.call(this);

      this.statement = statement;
    },

    toJs: function(context) {
      context.e(this.statement, ';');
    }
  });

  TerminatedStatement.of = function(statement) {
    return new TerminatedStatement(statement);
  };

  /**
   * Node for a blank statement.
   */
  var EmptyStatement = klass(nodes, Node, {
    initialize: function EmptyStatement() {},

    toJs: function(context) {}
  });

  /**
   * Node for a statement that declares a variable.
   */
  var VariableStatement = klass(nodes, Node, {
    initialize: function VariableStatement(variableDeclarationList) {
      Node.prototype.initialize.call(this);

      this.variableDeclarationList = variableDeclarationList;
    },

    toJs: function(context) {
      context.e('var ', this.variableDeclarationList);
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
      context.e(this.name, ' = ', this.value);
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
    },

    toJs: function(context) {
      context.e('if (', this.condition, ') {').blk()
        .e(this.ifBody)
      .end().e('}')
        .e(this.elseIfList)
        .e(this.elseBody);
    }
  });

  /**
   * Node that represents an if-statement that only takes up one line.
   */
  var OneLineIfStatement = klass(nodes, IfStatement, {
    initialize: function OneLineIfStatement(statement, condition) {
      IfStatement.prototype.initialize.call(this, condition, new TerminatedStatement(statement));
    }
  });

  /**
   * Node that represents a ruby-style unless control block.
   */
  var UnlessStatement = klass(nodes, IfStatement, {
    initialize: function UnlessStatement(condition, body) {
      var negatedCondition = new UnaryExpression('!', new NestedExpression(condition));
      IfStatement.prototype.initialize.call(this, negatedCondition, body);
    }
  });

  /**
   * Node that represents single-line unless statement.
   */
  var OneLineUnlessStatement = klass(nodes, UnlessStatement, {
    initialize: function OneLineUnlessStatement(statement, condition) {
      UnlessStatement.prototype.initialize.call(this, condition, new TerminatedStatement(statement));
    }
  });

  /**
   * Node that represents the else case of an if-statement.
   */
  var ElsePart = klass(nodes, Node, {
    initialize: function ElsePart(body) {
      Node.prototype.initialize.call(this);

      this.body = body;
    },

    toJs: function(context) {
      context.e(' else {').blk()
        .e(this.body)
      .end().e('}');
    }
  });

  /**
   * Node that represents an else-if case of an if-statement.
   */
  var ElseIf = klass(nodes, IfStatement, {
    initialize: function ElseIf(condition, body) {
      IfStatement.prototype.initialize.call(this, condition, body);
    },

    toJs: function(context) {
      context.e(' else ');

      IfStatement.prototype.toJs.call(this, context);
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
    },

    toJs: function(context) {
      context.e('while (', this.condition, ') {').blk()
        .e(this.body)
      .end().e('}');
    }
  });

  /**
   * Node that represents a while-loop with the condition negated.
   */
  var UntilLoop = klass(nodes, WhileLoop, {
    initialize: function UntilLoop(condition, body) {
      var negatedCondition = new UnaryExpression('!', new NestedExpression(condition));
      WhileLoop.prototype.initialize.call(this, negatedCondition, body);
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
    },

    toJs: function(context) {

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
    },

    toJs: function(context) {
      context.e(this.keyword, ' ', this.value);
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
