!function($) {
  var Compiler = klass({
    initialize: function Compiler() {
      this.emitter = new Emitter();
    },

    toJs: function(parseTree) {
      var context = new CompileContext(this.emitter);

      // Just so we can use global things in JS.
      // var names = Object.getOwnPropertyNames(window);
      // for (var i = 0; i < names.length; ++i) {
      //   context.put(names[i]);
      // }

      parseTree.toJs(context);

      return context.emitter.flush();
    },

    interpolate: function(string) {
      function balanceInterpolation(index) {
        for (var i = index; i < string.length; ++i) {
          switch (string[i]) {
            case '{':
              var end = balanceInterpolation(i + 1);
              i = end;
            case '}':
              return i;
          }
        }
      }

      var interpolatedString = '';
      var endOfLastInterpolation = 0;

      for (var i = 0; i < string.length; ++i) {
        if (string[i] === '\\') {
          i++;
          continue;
        }

        if (string[i] === '#' && string[i + 1] === '{') {
          var end = balanceInterpolation(i + 1);

          var before = string.substring(endOfLastInterpolation, i);
          var code = string.substring(i + 2, end);

          interpolatedString += before + "', " + code + ", '";

          endOfLastInterpolation = end + 1;
        }
      }

      interpolatedString += string.substring(endOfLastInterpolation);
      return;
    }
  });

  var Emitter = klass({
    initialize: function Emitter(outputBuffer, lines, indentLevel, context) {
      this.outputBuffer = outputBuffer || [];
      this.lines = lines || [this.outputBuffer];
      this.indentLevel = indentLevel || [''];
      this.context = context;
    },

    fromContext: function(context) {
      return new Emitter(this.outputBuffer, this.lines, this.indentLevel, context);
    },

    e: function() {
      for (var i = 0, len = arguments.length; i < len; ++i) {
        if (!arguments[i]) continue;

        if (arguments[i] instanceof nodes.Node) {
          arguments[i].toJs(this.context);
          continue;
        }

        switch (typeof arguments[i]) {
          case 'object':
            arguments[i] = arguments[i].value;
          case 'number':
          case 'string':
            this.outputBuffer.push(arguments[i]);
            break;
          case 'function':
            arguments[i]();
            break;
          default:
            if (arguments[i] instanceof Array) {
              this.e.apply(this, arguments[i]);
            }
        }
      }

      return this;
    },

    reset: function() {
      this.outputBuffer = [];
      this.lines = [this.outputBuffer];
      this.indentLevel = [''];
    },

    emitLines: function(lines) {
      for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        this.e(lines[i]);
        this.nl();
      }
    },

    flush: function() {
      var output = [];
      for (var i = 0; i < this.lines.length; ++i) {
        var lineStr = this.lines[i].join('');
        output.push(lineStr);
      }

      this.reset();

      return output.join('\n');
    },

    blk: function() {
      this.i();
      this.nl();
      return this;
    },

    end: function() {
      this.u();
      this.nl();
      return this;
    },

    nl: function() {
      this.outputBuffer = [this.indentLevel.peek()];
      this.lines.push(this.outputBuffer);
      return this;
    },

    i: function() {
      this.indentLevel.push(this.indentLevel.peek() + '  ');
      this.outputBuffer.push(this.indentLevel.peek());
      return this;
    },

    u: function() {
      if (this.outputBuffer.peek() === this.indentLevel.peek()) {
        this.outputBuffer.pop()
        this.indentLevel.pop();

        if (this.indentLevel.peek()) this.outputBuffer.push(this.indentLevel.peek());
      } else {
        this.indentLevel.pop();
      }

      return this;
    }
  });

  var Scope = klass({
    initialize: function Scope(parentScope) {
      this.parentScope = parentScope;
      this.fields = $.extend({}, false, parentScope);
    };

    subscope: function() {
      return new Scope(this);
    },

    hasSymbol: function(symbol) {
      symbol = symbol.value || symbol;

      return !!this.fields[symbol];
    },

    set: function(symbol, value) {
      symbol = symbol.value || symbol;

      this.fields[symbol] = value;
    },

    lookup: function(symbol) {
      symbol = symbol.value || symbol;

      if (!this.hasSymbol(symbol)) throw new errors.ReferenceError(symbol);

      return this.fields[symbol];
    },

    update: function(symbol, value) {
      symbol = symbol.value || symbol;
      this.lookup(symbol);

      this.fields[symbol] = value;
    }
  });

  var CompileContext = klass({
    initialize: function CompileContext(emitter) {
      this.emitter = emitter.fromContext(this);
      this.scope = new Scope();
    },

    e: function() {
      this.emitter.e.apply(this.emitter, arguments);
      return this.emitter;
    }
  });

  errors = {};

  var Error = klass(errors, {}, {
    initialize: function Error(line, message) {
      this.line = line;
      this.message = message;
    },

    toString: function() {
      return this.constructor.name + '(' + this.line + '): ' + this.message;
    }
  });

  var ReferenceError = klass(errors, Error, {
    initialize: function ReferenceError(line, reference) {
      Error.prototype.initialize.call(this, line, reference + ' is not defined');
    }
  });
}(jQuery);
