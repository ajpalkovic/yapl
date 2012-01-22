var Lexer = (function($) {

  return Class.create({
    initialize: function Lexer(string) {
      this.tokens = this.__lex(string);
      this.currentPos = 0;
      this.lastPos = 0;
    },

    next: function(newlines) {
      this.lastPos = Math.max(this.currentPos, this.lastPos);
      return this.tokens[this.currentPos++];
    },

    last: function() {
      return this.tokens[this.lastPos];
    },

    __lex: function(string) {
      var tokens = [];
      var line = 0;

      while (string.length > 0) {
        var match = string.match(Token.regex);
        var endOfMatch;
        var token = undefined;

        if (match) {
          token = Token.types[match[0]]();
          endOfMatch = match[0].length;
        } else {
          var result = Token.identify(string);

          if (result) {
            token = result.token;
            endOfMatch = result.position;
          } else {
            throw 'Syntax Error: Illegal token: ' + string;
          }
        }

        if (token.type === 'NEWLINE') {
          line++;
        } else {
          token.line = line;
        }

        !token.ignore && tokens.push(token);
        string = string.substring(endOfMatch);
      }

      return tokens;
    }

    // Not needed for now as the parser will handle optional tokens (aka newlines).
    // This also needs extra logic to keep track of line #s for error reporting.

    /*__condense: function(tokens) {
      for (var i = 0, len = tokens.length; i < len; ++i) {
        for (var j = i; j < len; ++j) {
          if (tokens[j].type !== 'NEWLINE') break;
        }

        if (i != j) {
          tokens.splice(i, j - i, tokens[i]);
          i = j;
        }
      }

      return tokens;
    }*/
  });
})(jQuery);
