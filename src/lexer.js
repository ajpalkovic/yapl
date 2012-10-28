!function($) {
  var SyntaxError = klass({
    initialize: function SyntaxError(line, col, token) {
      this.line = line;
      this.col = col;
      this.token = token;
    },

    toString: function() {
      return 'SyntaxError(' + this.line + ':' + this.col + '): Unexpected token ' + this.token;
    }
  });

  var Lexer = klass({
    /**
     * Lexer implementation for Yapl.
     */
    initialize: function Lexer(string) {
      this.tokens = this._lex(string);
      this.currentPos = 0;
      this.lastPos = 0;
    },

    /**
     * Returns the next token in the lexer, and advances it.
     */
    next: function() {
      this.lastPos = (this.currentPos < this.tokens.length) ?
          Math.max(this.currentPos, this.lastPos) : this.lastPos;

      return this.get(this.currentPos++);
    },

    /**
     * Returns the next token in the lexer, without advancing it.
     */
    peek: function() {
      return this.get(this.currentPos);
    },

    /**
     * Returns the last token the lexer has reached.
     */
    last: function() {
      return this.get(this.lastPos);
    },

    /**
     * Returns the token at the specified index.
     */
    get: function(index) {
      return this.tokens[index];
    },

    findNext: function(skipOptional) {
      var current = this.currentPos;
      var token;
      while ((token = this.get(current++)) && skipOptional && token.optional);

      return token;
    },

    /**
     * Lexes a string into a stream of tokens.
     */
    _lex: function(string) {
      var tokens = [];
      var line = 1;
      var col = 0;

      while (string.length > 0) {
        var match = string.match(Token.regex);
        var endOfMatch;
        var token = undefined;

        if (match) {
          token = Token.typeLookup[match[0]]();
          endOfMatch = match[0].length;
        } else {
          var result = Token.identify(string, tokens);

          if (result) {
            token = result.token;
            endOfMatch = result.position;
          } else {
            throw new SyntaxError(line, col, string[0]);
          }
        }

        if (token.type === 'NEWLINE') {
          token.line = line++;
          col = 0;
        } else {
          token.line = line;
          col += endOfMatch;
        }

        if (!token.ignore) tokens.push(token);
        string = string.substring(endOfMatch);
      }
      // We add an end-of-file token to the end of the stream.
      var eofTokens = Token.typeLookup['<<EOF>>']();
      eofTokens.line = line;
      tokens.push(eofTokens);

      return tokens;
    }
  });
}(jQuery);
