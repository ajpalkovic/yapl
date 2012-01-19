var Parser = (function($) {
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

  // TODO: write the new parse method that works on the grammar.  The caching below will
  // still be useful.

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

        if (result) {
          // After calling a parse function, the lexer position could have
          // advanced, so that would be the 'next position' of the lexer
          // if we ever end up running this parse function at the same
          // position again.
          this.cache[fnName][startPos] = {
            nextPos: this.lexer.currentPos,
            result: result
          };
        } else {
          this.lexer.currentPos = startPos;
        }

        return result;
      };
    })(fnName);
  }

  return Class.create(methods);
})(jQuery);
