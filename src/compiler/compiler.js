!function($) {
  var Compiler = klass({
    initialize: function Compiler() {
      this.emitter = new Emitter();
      this.passes = [
        new pass.CheckVarsDefinedPass(),
        new pass.ExpandClosuresTransformer(),
        new pass.ConditionalLoadTransformer(),
        new pass.ClassDeclarationPass(),
        new pass.SyntaxAugmentationTransformer(),
        new pass.CallOrIdentifierTransformer()
      ];
    },

    compile: function(tree) {
      var result = tree;
      this.passes.each(function(pass) {
        pass.run(tree);
      });

      return result;
    },

    stringify: function(ast) {
      var emitter = new Emitter();

      function stringifyChildren(parent) {
        var length = parent.children().length;

        parent.children().each(function(i) {
          stringify($(this));

          if (i < length - 1) emitter.nl();
        });
      }

      function stringify(ast) {
        if (ast.type() === 'token') {
          emitter.e('(', ast.type(), ' "' + ast.text() + '")');
          return;
        }

        emitter.e('(', ast.type()).blk();
        stringifyChildren(ast);
        emitter.end().e(')');
      }

      stringify(ast);
      return emitter.flush();
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

        if (arguments[i] instanceof Token) {
          this.outputBuffer.push(arguments[i].value);
          continue;
        }

        switch (typeof arguments[i]) {
          case 'object':
          case 'number':
          case 'string':
            this.outputBuffer.push(arguments[i]);
            break;
          case 'function':
            // We always pass the context.
            arguments[i](this.context);
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
}(jQuery);
