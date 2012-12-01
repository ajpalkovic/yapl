!function($) {
  var Parser = klass({
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
      this.cache = {};

      this.lexer = new Lexer(input);
      var tree = this._parse('Program', 0, {});

      // tree can be null, means there was just no value.
      if (tree === undefined) this.error();

      return tree;
    },

    /**
     * Parses an individual rule of the grammar.
     */
    _parse: function(currentRule, startPos, redefinitions) {
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
      // We check both the next optional/non-optional tokens so that in case one of the rules wants
      // to prohibit an optional token, the next optional token won't be skipped.
      var nextNonOptional = this.lexer.findNext(true);
      var nextOptional = this.lexer.findNext(false);
      var lookaheadFufilled = true;

      if (rule.lookahead) {
        if (nextNonOptional) lookaheadFufilled = rule.lookahead[nextNonOptional.type] !== false;
        if (nextOptional) lookaheadFufilled = lookaheadFufilled && rule.lookahead[nextOptional.type] !== false;
      }

      // If the lookahead wasn't fufilled, then we consider the parsing a failure.
      var cacheEntry = undefined;
      if (lookaheadFufilled) cacheEntry = this._parseRule(currentRule, rule, startPos, redefinitions);

      cacheEntry = cacheEntry || {
        nextPos: startPos,
        result: undefined
      };

      return (this.cache[currentRule][startPos] = cacheEntry).result;
    },

    /**
     *  Mutually recursively parses the grammar with _parse.
     */
    _parseRule: function(ruleName, rule, startPos, redefinitions) {
      var productions = redefinitions[ruleName] || rule.productions;

      // Extends the productions with the redefinitiosn if there are any.
      if (rule.redefinitions) {
        redefinitions = $.extend({}, redefinitions, rule.redefinitions);
      }

      for (var i = 0, numProds = productions.length; i < numProds; ++i) {
        var production = productions[i];

        var parseFailed = false;
        var parseResults = [];

        for (var j = 0, numElements = production.length; j < numElements; ++j) {
          var currentSymbol = production[j];
          var nonCapture = !!currentSymbol.match(/^\(\?[^\)]+\)$/);

          if (nonCapture) currentSymbol = currentSymbol.substring(2, currentSymbol.length - 1);

          if (Grammar[currentSymbol]) {
            var parseResult = this._parse(currentSymbol, this.lexer.currentPos, redefinitions);

            // We only take the result if the parse didn't fail (was undefined), and the symbol
            // wasn't specified as a non-capture.
            if (parseResult !== undefined && !nonCapture) {
              parseResults.push(parseResult);
            }

            parseFailed = parseResult === undefined;
          } else {
            var matchResult = this._match(currentSymbol);
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
          var action = ParseActions[rule.nodeType || ruleName];

          if (action) {
            var result = action.apply(this, parseResults);
          } else {
            var result = parseResults[0];
          }

          // After calling a parse function, the lexer position could have
          // advanced, so that would be the 'next position' of the lexer
          // if we ever end up running this parse at the same
          // position again.
          return {
            nextPos: this.lexer.currentPos,
            result: result || null
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

      // We only capture the value of tokens surrounded by parens.
      if (expectedTokenType.match(/^\([^\)]+\)$/)) {
        var capture = true;
        expectedTokenType = expectedTokenType.substring(1, expectedTokenType.length - 1);
      }

      var tokensMatch = expectedTokenType === lexedToken.type;

      var matched = tokensMatch || lexedToken.optional
      var advance = tokensMatch || !lexedToken.optional;

      return {
        value: tokensMatch && capture && lexedToken,
        matched: matched,
        advance: advance
      };
    },

    /**
     * Returns whether or not the next token in the lexer matches the negative
     * token.
     */
    passesNegativeLookahead: function(negativeToken) {
      var nextNonOptional = this.lexer.findNext(true);
      var nextOptional = this.lexer.findNext(false);

      if (nextNonOptional) return nextNonOptional.type !== negativeToken;
      if (nextOptional) return nextOptional.type !== negativeToken;

      // No more tokens in the lexer.
      return true
    },

    /**
     * Error for the parser that is called when the parse fails.
     */
    error: function() {
      var last = this.lexer.last();
      throw ['ParseError(', last.line, '): Unexpected ', last.type].join('');
    }
  });

  var InterpolationParser = klass(Parser, {
    initialize: function InterpolationParser() {
      Parser.prototype.initialize.call(this);
    },

    parse: function(input, lineOffset) {
      this.cache = {};

      this.lexer = new Lexer(input, lineOffset);
      var tree = this._parse('InterpolationBody', 0, {});

      // tree can be null, means there was just no value.
      if (tree === undefined) this.error();

      return tree;
    }
  });
}(jQuery);
