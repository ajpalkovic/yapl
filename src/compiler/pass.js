!function($) {
  pass = {};

  var Pass = klass(pass, {}, {
    initialize: function Pass(selectorMappings) {
      this.selectorMappings = selectorMappings;
    },

    run: function(ast, compiler) {
      var _this = this;
      $.each(this.selectorMappings, function(selector, fn) {
        ast.find(selector).each(function(i) {
          _this.handleMatch($(this), fn, compiler);
        });
      });
    },

    handleMatch: function(match, fn, compiler) {
      fn.call(this, match, compiler);
    }
  });

  var Transformer = klass(pass, Pass, {
    initialize: function Transformer(selectorMappings) {
      pass.Pass.prototype.initialize.call(this, selectorMappings);
    },

    handleMatch: function(match, fn, compiler) {
      var replacement = fn.call(this, match, compiler);
      if (replacement === undefined) return;

      if (replacement !== match) {
        replacement.attr('class', match.attr('class'));
        match.replaceWith(replacement);
      }
    }
  });

  var ScopedPass = klass(pass, Pass, {
    initialize: function ScopedPass(selectorMappings) {
      pass.Pass.prototype.initialize.call(this, selectorMappings);

      this.scopeSelector = [
        'class_declaration',
        'function_declaration',
        'function_expression',
        'closure',
        'method'
      ].join(', ');

      this.declarationSelector = [
        'class_declaration',
        'variable_declaration',
        'method',
        'instance_var_declaration',
        'closure_parameter',
        'function_declaration',
        'function_expression',
      ].join(', ');

      // We don't want any static methods or variables.
      this.instanceDeclarationSelector = [
        'class_body > method',
        'class_body > static_method > method',
        'class_body > instance_var_declaration_statement instance_var_declaration',
        'class_body > static_var_declaration_statement > variable_statement variable_declaration'
      ].join(', ')
    },

    getSymbolName: function(symbolNode) {
      return symbolNode.children('.name').text();
    },

    runWithScopeNode: function(scopeNode, scope, compiler) {
      // If the current node creates a new lexical scope,
      // create a new scope and add it to its own scope.
      var classContext = scopeNode.is('class_declaration') ? new Context(scopeNode) : undefined;
      var context = scopeNode.is('class_body > method') ? scope.classContext : undefined;

      scope = scope.subscope(classContext, context);

      var symbolName = this.getSymbolName(scopeNode);

      // Lift all declarations in the current node into scope.
      this.liftDeclarations(scopeNode, scope, compiler);
      this.traverseChildren(scopeNode, scope, compiler);
    },

    traverseChildren: function(node, scope, compiler) {
      var _this = this;

      $.each(_this.selectorMappings, function(selector, fn) {
        if (node.is(selector)) _this.handleMatch(node, fn, scope, compiler);
      });

      node.children().each(function(i) {
        var child = $(this);

        if (child.is(_this.scopeSelector)) {
          _this.runWithScopeNode(child, scope, compiler);
        } else {
          _this.traverseChildren(child, scope, compiler);
        }
      });
    },

    liftDeclarations: function(currentNode, scope, compiler) {
      var _this = this;

      currentNode.children().each(function(i) {
        var child = $(this);

        // If the child is a declaration, add it to the symbol table.
        if (child.is(_this.declarationSelector)) {
          var symbolName = _this.getSymbolName(child);

          if (_this.onDeclaration) _this.onDeclaration(symbolName, child, scope, compiler);

          if (!child.is(_this.instanceDeclarationSelector)) {
            scope.set(symbolName, child);
          } else {
            scope.classContext.declare(child);
          }
        }

        // We only traverse down if the child does not signify a new
        // lexical scope.
        if (!child.is(_this.scopeSelector)) _this.liftDeclarations(child, scope, compiler);
      });
    },

    run: function(ast, compiler) {
      var context = new Context(ast);

      this.runWithScopeNode(ast, new Scope(undefined, context, context), compiler);
    }
  });

  var ScopedTransformer = klass(pass, ScopedPass, {
    initialize: function ScopedTransformer(selectorMappings) {
      pass.ScopedPass.prototype.initialize.call(this, selectorMappings);
    },

    handleMatch: function(match, fn, scope, compiler) {
      var replacement = fn.call(this, match, scope, compiler);
      if (replacement === undefined) return;

      if (replacement !== match) {
        replacement.attr('class', match.attr('class'));
        match.replaceWith(replacement);
      }
    }
  });

  var EmitterPass = klass(pass, Pass, {
    initialize: function EmitterPass(selectorMappings) {
      Pass.prototype.initialize.call(this, selectorMappings);
    },

    run: function(ast, compiler) {
      return this.runWithEmitter(ast, new Emitter(this.runWithEmitter.bind(this)), compiler);
    },

    runWithEmitter: function(node, emitter, compiler) {
      var _this = this;
      $.each(selectorMappings, function(selector, fn) {
        if (node.is(selector)) fn.call(_this, selector, emitter, compiler);
      });
    }
  });
}(jQuery);