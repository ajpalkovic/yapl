stack = [];

var Parser = (function($) {
  var INDENT = [''];

  function dbg() {
    return;
    var args = Array.prototype.slice.call(arguments, 0);
    args.splice(0, 0, INDENT[INDENT.length - 1]);
    args.push('\n');
    var element = $('#debug');
    element.text(element.text() + args.join(' '));
    //console.log(args.join(' '));
  }

  function dbg_i() {
    arguments.length && dbg.apply(this, arguments);
    INDENT.push(INDENT[INDENT.length - 1] + '    ');
  }

  function dbg_u() {
    INDENT.pop();
    arguments.length && dbg.apply(this, arguments);
  }

  return Class.create({
    initialize: function Parser() {
      this.lexer = undefined;
      this.cache = {};
    },
    
    parse: function(input) {
      var _this = this;
      this.cache = {};

      this.lexer = new Lexer(input);
      var tree = this.__parse('Program', 0);

      if (!tree) {
        this.error();
      }

      return tree;
    },

    __parse: function(currentRule, startPos) {
      dbg_i('o Parsing', currentRule, '{');

      var cached = (this.cache[currentRule] || (this.cache[currentRule] = []))[startPos];
      if (cached) {
        dbg('**** Cache hit! Parsed this rule at position', startPos, 'in token stream! Moving to ', cached.nextPos);
        if (cached.result) this.lexer.currentPos = cached.nextPos;

        dbg_u('}');
        return cached.result;
      }

      var rule = Grammar[currentRule];

      stack.push(currentRule);

      // If a rule has no lookahead requirements, or it does, but the next token in the lexer
      // is in the lookahead map positively, then we have fufilled the lookahead condition.
      // If it is in the map but negatively, then it fails.  If there was not another token in
      // the stream, we can just say it passed and let the later logic handle it.
      var nextToken = this.lexer.peek();
      var lookaheadFufilled = !nextToken || (!rule.lookahead || (rule.lookahead[nextToken.type] != false));

      // If the lookahead wasn't fufilled, then we consider the parsing a failure.
      var cacheEntry = undefined;
      if (lookaheadFufilled) {
        cacheEntry = this.__parseRule(currentRule, rule, startPos);
      } else {
        dbg('. Negative lookahead prohibits', nextToken.type, '! Moving on...');
      }

      cacheEntry = cacheEntry || {
        nextPos: startPos,
        result: undefined
      };

      dbg_u('}');

      stack.pop();

      return (this.cache[currentRule][startPos] = cacheEntry).result;
    },

    __parseRule: function(ruleName, rule, startPos) {
      for (var i = 0, numProds = rule.productions.length; i < numProds; ++i) {
        var production = rule.productions[i];

        dbg_i('- Current production:', production);

        var parseFailed = false;
        var parseResults = [];

        for (var j = 0, numElements = production.length; j < numElements; ++j) {
          var expectedTokenType = production[j];

          if (Grammar[expectedTokenType]) {
            var parseResult = this.__parse(expectedTokenType, this.lexer.currentPos);
            var capture = !expectedTokenType.match(/^\?\:/);

            if (parseResult && capture) parseResults.push(parseResult);
            parseFailed = !parseResult;
          } else {
            var matchResult = this.__match(expectedTokenType);
            if (matchResult) {
              if (matchResult.value) parseResults.push(matchResult.value);

              if (!matchResult.advance) j--;
            }

            parseFailed = !matchResult.matched;
          }

          if (parseFailed) break;
        }

        if (!parseFailed) {
          dbg_u('- Successfully parsed production!!', production);
          //console.log("we parsed a", ruleName, "with production", production);

          //var result = rule.onParse[i].apply(parseResults);

          // After calling a parse function, the lexer position could have
          // advanced, so that would be the 'next position' of the lexer
          // if we ever end up running this parse function at the same
          // position again.
          return {
            nextPos: this.lexer.currentPos,
            result: {
              aName: ruleName,
              children: parseResults
            }
          };
        } else {
          dbg_u('- Failed to parse production', production, '!!');

          // We need to reset the lexer to where we were when
          // we started parsing the current rule because the previous
          // production failed to parse.
          this.lexer.currentPos = startPos;
        }
      }

      return undefined;
    },

    __match: function(expectedTokenType) {
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

      dbg(expectedTokenType, 'matched:', matched, 'got:', lexedToken.type);

      return {
        value: capture && (lexedToken.value || lexedToken.type),
        matched: matched,
        advance: advance
      };
    },

    passesNegativeLookahead: function(expectedTokenType) {
      var nextToken = this.lexer.peek();
      return !nextToken || nextToken.type !== expectedTokenType;
    },

    error: function() {
      var last = this.lexer.last();
      throw ['ParseError: Unexpected', last.type, 'at line', last.line + 1].join(' ');
    }
  });
})(jQuery);
