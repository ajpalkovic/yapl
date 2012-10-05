!function($) {
  var Compiler = klass({
    initialize: function Compiler() {
      this.emitter = new Emitter();
    },

    toJs: function(parseTree) {
      var context = new CompileContext(this.emitter);
      parseTree.toJs(context);

      return context.getEmitter().flush();
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
    initialize: function Emitter() {
      this.outputBuffer = undefined;
      this.lines = undefined;
      this.indentLevel = undefined;

      this.reset();
    },

    e: function(varargs) {
      for (var i = 0, len = arguments.length; i < len; ++i) {
        if (!arguments[i]) continue;

        switch (typeof arguments[i]) {
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

  var CompileContext = klass({
    initialize: function CompileContext(emitter, parentContext) {
      this.emitter = emitter;
      this.parentContext = parentContext;

      this.scope = $.extend({}, parentContext && parentContext.getScope());
    },

    subcontext: function() {
      return new CompileContext(this.emitter, this);
    },

    put: function(name, value) {
      this.scope[name] = value || true;
    },

    lookup: function(name) {
      return this.scope[name];
    },

    getEmitter: function() {
      return this.emitter;
    },

    getParentContext: function() {
      return this.getParentContext;
    },

    getScope: function() {
      return this.scope;
    }
  });
}(jQuery);
