var Lexer = (function($) {

  return Class.create({
    initialize: function Lexer(string) {
      this.tokens = this.__lex(string);
      this.currentPos = 0;
      this.lastPos = 0;
    },

    next: function(newlines) {
      this.lastPos = (this.currentPos < this.tokens.length) ? 
          Math.max(this.currentPos, this.lastPos) : this.lastPos;
      return this.__get(this.currentPos++);
    },

    peek: function() {
      return this.__get(this.currentPos);
    },

    last: function() {
      return this.tokens[this.lastPos];
    },

    __get: function(index) {
      return this.tokens[index];
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
          var result = Token.identify(string, tokens);

          if (result) {
            token = result.token;
            endOfMatch = result.position;
          } else {
            throw 'Syntax Error: Illegal token: ' + string;
          }
        }

        if (token.type === 'NEWLINE') {
          token.line = line++;
        } else {
          token.line = line;
        }

        if (!token.ignore) tokens.push(token);
        string = string.substring(endOfMatch);
      }

      // We add an end-of-file token to the end of the stream.
      var eofToken = Token.types['<<EOF>>']();
      eofToken.line = line;
      tokens.push(eofToken);
      return tokens;
    }
  });
})(jQuery);
