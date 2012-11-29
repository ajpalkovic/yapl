!function($) {
  var Compiler = klass({
    initialize: function Compiler() {
      this.emitter = new Emitter();
      this.passes = [
        new pass.StringInterpolationPass(),
        // Might need to declare some variables that are implicitly defined
        // before the compiler checks for them.
        new pass.SyntaxAugmentationTransformer(),
        new pass.CheckVarsDefinedPass(),
        new pass.ExpandClosuresTransformer(),
        new pass.ConditionalLoadTransformer(),
        new pass.ClassBodyTransformer(),
        new pass.SpecialParametersTransformer(),
        new pass.ClassDeclarationTransformer(),
        // new pass.CallOrIdentifierTransformer()
      ];

      this.parser = window.parser = new Parser();
    },

    parse: function(input) {
      return this.parser.parse(input);
    },

    compile: function(input) {
      var tree = this.parse(input);
      var result = tree;

      this.passes.each(function(pass) {
        var result = pass.run(tree, compiler);
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
    }
  });

  var Emitter = klass({
    initialize: function Emitter(nodeHandler, outputBuffer, lines, indentLevel) {
      this.nodeHandler = nodeHandler;
      this.outputBuffer = outputBuffer || [];
      this.lines = lines || [this.outputBuffer];
      this.indentLevel = indentLevel || [''];
    },

    e: function() {
      for (var i = 0, len = arguments.length; i < len; ++i) {
        if (!arguments[i]) continue;

        if (arguments[i] instanceof Token) {
          this.outputBuffer.push(arguments[i].value);
          continue;
        }

        switch (typeof arguments[i]) {
          case 'number':
          case 'string':
            this.outputBuffer.push(arguments[i]);
            break;
          case 'function':
            // We always pass the context.
            arguments[i]();
            break;
          default:
            nodeHandler(arguments[i], this);
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
