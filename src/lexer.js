var Lexer = (function($) {

  return Class.create({
    initialize: function Lexer(string) {
      this.tokens = this.__lex(string);
      this.currentPos = 0;
    },

    peek: function() {
      return this.tokens[this.currentPos + 1];
    },

    next: function() {
      return this.tokens[this.currentPos++];
    },

    setPosition: function(currentPos) {
      this.currentPos = currentPos;
    },

    __lex: function(string) {
      var tokens = [];

      while (string.length > 0) {
        var match = string.match(Token.regex);
        var endOfMatch;

        if (match) {
          var token = Token.types[match[0]]().token;
          token && tokens.push(token);
          endOfMatch = match[0].length;
        } else {
          var result = Token.identify(string);

          if (result) {
            result.token && tokens.push(result.token);
            endOfMatch = result.position;
          } else {
            throw 'Syntax Error: Illegal token: ' + string;
          }
        }

        string = string.substring(endOfMatch);
      }

      return tokens;
    },

    toString: function() {
      return $.map(this.tokens, function(token, index) { return ['<', token.type, ' value=', token.value, '>'].join(''); }).join('\n');
    }
  });
})(jQuery);
