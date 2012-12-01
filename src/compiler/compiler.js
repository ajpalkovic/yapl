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

      this.outputPasses = {
        'js': new pass.ToJsEmitter()
      };

      this.parser = window.parser = new Parser();
    },

    parse: function(input) {
      return this.parser.parse(input);
    },

    compile: function(input, target, onPassCompletedHandler) {
      var totalStartTime = new Date().getTime();
      var tree = this.parse(input);

      target = target || Compiler.target.js;

      this.passes.each(function(pass) {
        var startTime = new Date().getTime();
        pass.run(tree, compiler);
        var endTime = new Date().getTime();

        if (onPassCompletedHandler) onPassCompletedHandler(pass.constructor.name, endTime - startTime);
      });

      if (!this.outputPasses[target]) {
        throw 'Invalid output target: "' + target + "'";
      }

      var output = this.outputPasses[target].run(tree, compiler).flush()
      var totalEndTime = new Date().getTime();

      if (onPassCompletedHandler) {
        onPassCompletedHandler(this.outputPasses[target].constructor.name, totalEndTime - totalStartTime);
      }

      return output;
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

  Compiler.target = {
    js: 'js'
  };

  var Emitter = klass({
    initialize: function Emitter(nodeHandler, outputBuffer, lines, indentLevel) {
      this.nodeHandler = nodeHandler;
      this.outputBuffer = outputBuffer || [];
      this.lines = lines || [this.outputBuffer];
      this.indentLevel = '';
    },

    e: function() {
      for (var i = 0, len = arguments.length; i < len; ++i) {
        if (!arguments[i]) continue;

        switch (typeof arguments[i]) {
          case 'number':
          case 'string':
            var newlineIndex = arguments[i].indexOf('\n');
            if (newlineIndex >= 0) {
              var before = arguments[i].substring(0, newlineIndex);
              var after = arguments[i].substring(newlineIndex + 1);

              this.e(before);
              this.nl();
              this.e(after);

              break;
            }

            this.outputBuffer.push(arguments[i]);
            break;
          case 'function':
            // We always pass the context.
            arguments[i]();
            break;
          default:
            if (arguments[i].is('token')) {
              this.outputBuffer.push(arguments[i].text());
              continue;
            }

            this.nodeHandler(arguments[i], this);
        }
      }

      return this;
    },

    reset: function() {
      this.outputBuffer = [];
      this.lines = [this.outputBuffer];
      this.indentLevel = '';
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
      this.outputBuffer = [this.indentLevel];
      this.lines.push(this.outputBuffer);
      return this;
    },

    i: function() {
      this.indentLevel = this.indentLevel + '  ';
      this.outputBuffer.push(this.indentLevel);
      return this;
    },

    u: function() {
      if (this.outputBuffer.peek() === this.indentLevel) {
        this.outputBuffer.pop()
        this.indentLevel = this.indentLevel.substring(0, this.indentLevel.length - 2);

        if (this.indentLevel) this.outputBuffer.push(this.indentLevel);
      } else {
        this.indentLevel = this.indentLevel.substring(0, this.indentLevel.length - 2);
      }

      return this;
    }
  });
}(jQuery);
