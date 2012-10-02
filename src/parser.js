!function($) {
  klass({
    /**
     * Yapl's parser implementation.
     */
    initialize: function Parser() {
      this.lexer = undefined;
      this.cache = {};
    },

    /**
     * Parses the input string and returns an AST representing the parsed
     * string.
     */
    parse: function(input) {
      var _this = this;
      this.cache = {};

      this.lexer = new Lexer(input);
      var tree = this._parse('Program', 0);

      if (!tree) {
        this.error();
      }

      return tree;
    },

    /**
     * Parses an individual rule of the grammar.
     */
    _parse: function(currentRule, startPos) {
      var cached = (this.cache[currentRule] || (this.cache[currentRule] = []))[startPos];

      if (cached) {

        // We hit the cache, so just return what we already have.
        if (cached.result) this.lexer.currentPos = cached.nextPos;
        return cached.result;
      }

      var rule = Grammar[currentRule];

      // If a rule has no lookahead requirements, or it does, but the next token in the lexer
      // is in the lookahead map positively, then we have fufilled the lookahead condition.
      // If it is in the map but negatively, then it fails.  If there was not another token in
      // the stream, we can just say it passed and let the later logic handle it.
      var nextToken = this.lexer.peek();
      var lookaheadFufilled = !nextToken || (!rule.lookahead || (rule.lookahead[nextToken.type] != false));

      // If the lookahead wasn't fufilled, then we consider the parsing a failure.
      var cacheEntry = undefined;
      if (lookaheadFufilled) cacheEntry = this._parseRule(currentRule, rule, startPos);

      cacheEntry = cacheEntry || {
        nextPos: startPos,
        result: undefined
      };

      return (this.cache[currentRule][startPos] = cacheEntry).result;
    },

    /**
     *  Mutually recursively parses the grammar with _parse.
     */
    _parseRule: function(ruleName, rule, startPos) {
      for (var i = 0, numProds = rule.productions.length; i < numProds; ++i) {
        var production = rule.productions[i];

        var parseFailed = false;
        var parseResults = [];

        for (var j = 0, numElements = production.length; j < numElements; ++j) {
          var expectedTokenType = production[j];

          if (Grammar[expectedTokenType]) {
            var parseResult = this._parse(expectedTokenType, this.lexer.currentPos);
            var capture = !expectedTokenType.match(/^\?\:/);

            if (parseResult && capture) parseResults.push(parseResult);
            parseFailed = !parseResult;
          } else {
            var matchResult = this._match(expectedTokenType);
            if (matchResult) {
              if (matchResult.value) parseResults.push(matchResult.value);

              // We might not want to advance to the next element of the production
              // depending on how the terminal matched.
              if (!matchResult.advance) j--;
            }

            parseFailed = !matchResult.matched;
          }

          if (parseFailed) break;
        }

        if (!parseFailed) {
          var node = ParseActions[ruleName];

          if (node) {
            var result = node.onParse.apply(this, parseResults);
          } else {
            var result = parseResults[0];
          }

          // After calling a parse function, the lexer position could have
          // advanced, so that would be the 'next position' of the lexer
          // if we ever end up running this parse at the same
          // position again.
          return {
            nextPos: this.lexer.currentPos,
            result: result || {}
          };
        } else {
          // We need to reset the lexer to where we were when
          // we started parsing the current rule because the previous
          // production failed to parse.
          this.lexer.currentPos = startPos;
        }
      }

      return undefined;
    },

    /**
     * Matches the provided terminal token from the grammar to the next token in
     * the lexer, considering lookahead constraints.
     */
    _match: function(expectedTokenType) {
      // If there is a negative lookahead condition, check to see that
      // we passed it.
      if (expectedTokenType.match(/^!.+/)) {
        var passes = this.passesNegativeLookahead(expectedTokenType.substring(1));

        return {
          value: undefined,
          matched: passes,
          advance: passes
        };
      }

      var lexedToken = this.lexer.next();
      var advance = true;

      // Hit the end of the token stream so we failed.
      if (!lexedToken) return {};

      if (expectedTokenType.match(/^\([^\)]+\)$/)) {
        var capture = true;
        expectedTokenType = expectedTokenType.substring(1, expectedTokenType.length - 1);
      }

      var tokensMatch = expectedTokenType === lexedToken.type;

      var matched = tokensMatch || lexedToken.optional
      var advance = tokensMatch || !lexedToken.optional;

      return {
        value: tokensMatch && capture && (lexedToken.value || lexedToken.type),
        matched: matched,
        advance: advance
      };
    },

    /**
     * Returns whether or not the next token in the lexer matches the negative
     * token.
     */
    passesNegativeLookahead: function(negativeToken) {
      var nextToken = this.lexer.peek();
      return !nextToken || nextToken.type !== negativeToken;
    },

    /**
     * Error for the parser that is called when the parse fails.
     */
    error: function() {
      var last = this.lexer.last();
      throw ['ParseError: Unexpected', last.type, 'at line', last.line + 1].join(' ');
    }
  });
}(jQuery);
