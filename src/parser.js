var Parser = (function($) {
  var functions = {
    parseProgram: function() {
      this.cahce['program'] || this.cache['program'] = [];

      var cached = this.cache['program'][this.lexer.currentPos];
      if (cached) {
        this.lexer.setPosition(cached.position);
        return cached.result;
      }

      var element = undefined;
      var source = [];

      while (element = this.parseSourceElement()) {
        source.push(element);
      }

      return this.cache['program'][this.lexer.currentPos] = {
        type: 'program',
        source: source
      };
    },

    parseSourceElement:  function() {
      this.cache['sourceElement'] || this.cache['sourceElement'] = [];

      var result = this.tryParse(this.parseStatement, 
                                 this.parseClass, 
                                 this.parseFunctionDeclaration, 
                                 this.parseClosure);

      if (!result) this.error();

      return result;
    },

    parseClass: function() {
      if (this.lexer.peek() !== Token.Type.CLASS) return undefined;
      this.lexer.toNextUsable();

      var name = this.lexer.next();
    },

    parseClassBody: function() {


    },

    parseClassElement: function() {


    },

    parseMethod: function() {


    },

    parseInstanceVarDeclaration: function() {


    },

    parseAccessor: function() {


    },

    parseFunctionDeclaration: function() {


    },

    parseClosure: function() {


    },

    parseFunctionExpression: function() {


    },

    parseClassExpression: function() {


    },

    parseParameters: function() {


    },

    parseParameter: function() {


    },

    parseVarArgs: function() {


    },

    parseFunctionBody: function() {


    },

    parseMemberIdentifier: function() {


    },

    parseArrayLiteral: function() {


    },

    parseObjectLiteral: function() {


    },

    parseProperties: function() {


    },

    parseProperty: function() {


    },

    parseExpressionList: function() {


    },

    parseExpression: function() {


    },

    parseNewExpression:  function() {


    },

    parseMemberExpression:  function() {


    },

    parseArrayDereference: function() {


    },

    parseArguments: function() {


    },

    parseArgumentList: function() {


    },

    parsePrimaryExpression:  function() {


    },

    parseAssignmentOperator: function() {


    },

    parseRelativeOperator: function() {


    },

    parseAddOperator: function() {


    },

    parseMultiplicationOp: function() {


    },

    parseStatement: function() {


    },

    parseEndSt: function() {


    },

    parseStatementList:  function() {


    },

    parseEmptyStatement: function() {


    },

    parseExpressionStatement: function() {


    },

    parseVariableStatement:  function() {


    },

    parseVariableDeclarationList:  function() {


    },

    parseVariableDeclaration:  function() {


    },

    parseIfStatement:  function() {


    },

    parseUnlessStatement: function() {


    },

    parseBlockBody: function() {


    },

    parseElsePart: function() {


    },

    parseElseIfPart: function() {


    },

    parseElseIf: function() {


    },

    parseIterationStatement: function() {


    },

    parseWhileLoop: function() {


    },

    parseUntilLoop: function() {


    },

    parseDoUntilLoop: function() {


    },

    parseDoWhileLoop: function() {


    },

    parseForLoop: function() {


    },

    parseForLoopCondition: function() {


    },

    parseRegularForLoop: function() {


    },

    parseAdvancedForLoop: function() {


    },

    parseContinueStatement: function() {


    },

    parseBreakStatement: function() {


    },

    parseReturnStatement: function() {


    },

    parseWithStatement: function() {


    },

    parseSwitchStatement: function() {


    },

    parseCaseBlock: function() {


    },

    parseCaseClauses: function() {


    },

    parseCaseClause: function() {


    },

    parseCaseExpressionList: function() {


    },

    parseDefaultClause: function() {


    },

    parseAlwaysClause: function() {


    },

    parseLabelledStatement: function() {


    },

    parseThrowStatement: function() {


    },

    parseTryStatement: function() {


    },

    parseCatch: function() {


    },

    parseFinally: function() {
      

    }
  });

  var methods = {
    initialize: function Parser() {
      this.lexer = undefined;
      this.cache = {};
    },
    
    parse: function(input) {
      this.lexer = new Lexer(input);
      return this.parseProgram();
    },

    tryParse: function() {
      for (var i = 0, len = arguments.length; i < len; ++i) {
        var result = arguments[i].call(this);
        if (result) return result;
      }

      return undefined;
    },

    error: function() {
      
    }
  };

  // Wrap the parse functions in a caching mechanism to ensure redundant parsing
  // branches are never run at a given lexer position.
  for (var fnName in functions) {
    methods[fnName] = (function(fnName) {
      return function() {
        // This is the position of the lexer when we start parsing
        var startPos = this.lexer.currentPos;
        var cached = (this.cache[fnName] || this.cache[fnName] = [])[startPos];

        if (cached) {
          this.lexer.currentPos = cached.nextPos;
          return cached.result;
        }

        var result = functions[fnName].call(this);

        // After calling a parse function, the lexer position could have
        // advanced, so that would be the 'next position' of the lexer
        // if we ever end up running this parse function at the same
        // position again.
        this.cache[fnName][startPos] = {
          nextPos: this.lexer.currentPos,
          result: result
        };

        return result;
      };
    })(fnName);
  }

  return Class.create(methods);
})(jQuery);
