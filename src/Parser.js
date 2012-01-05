var Parser = (function($) {
  return Class.create({
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
      
    },

    parseProgram: function() {
      var sourceElement = undefined;
      var program = new Program();

      while (sourceElement = this.parseSourceElement()) {
        program.add(sourceElement);
      }

      return program;
    },

    parseSourceElement:  function() {
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
})(jQuery);
