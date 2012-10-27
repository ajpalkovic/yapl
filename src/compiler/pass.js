!function($) {
  pass = {};

  var Pass = klass(pass, {}, {
    initialize: function Pass(selectorMappings) {
      this.selectorMappings = selectorMappings;
    },

    run: function(ast, data) {
      var _this = this;
      $.each(this.selectorMappings, function(selector, fn) {
        ast.find(selector).each(function(i) {
          _this.handleMatch($(this), fn, data);
        });
      });
    },

    handleMatch: function(match, fn, data) {
      fn.call(this, match, data);
    }
  });

  var Transformer = klass(pass, Pass, {
    initialize: function Transformer(selectorMappings) {
      pass.Pass.prototype.initialize.call(this, selectorMappings);
    },

    handleMatch: function(match, fn, data) {
      var replacement = fn.call(this, match, data);
      if (replacement === undefined) return;

      if (replacement !== match) match.replaceWith(replacement);
    }
  });

  var ScopedTransformer = klass(pass, Transformer, {
    initialize: function ScopedTransformer(selectorMappings) {
      pass.Transformer.prototype.initialize.call(this, selectorMappings);

      this.scopes = [
        'class',
        'function_declaration',
        'function_expression',
        'method',
        'closure'
      ];

      this.declarations = [
        'class',
        'variable_declaration',
        'function_declaration',
        'function_expression',
        'method',
        'basic_parameter'
      ];

      this.scopeSelector = this.scopes.join(', ');
      this.declarationSelector = this.declarations.join(', ');
    },

    getSymbolName: function(symbolNode) {
      return symbolNode.children('.name').text();
    },

    runWithScopeNode: function(scopeNode, scope, data) {
      var _this = this;

      // If the current node creates a new lexical scope,
      // create a new scope and add it to its own scope.
      scope = scope.subscope();

      var symbolName = this.getSymbolName(scopeNode);
      if (symbolName) scope.set(symbolName, scopeNode);

      // Lift all declarations in the current node into scope.
      this.liftDeclarations(scopeNode, scope);
      this.traverseChildren(scopeNode, scope, data);
    },

    traverseChildren: function(node, scope, data) {
      var _this = this;

      node.children().each(function(i) {
        var child = $(this);

        if (child.is(_this.scopeSelector)) {
          _this.runWithScopeNode(child, scope, data);
        } else {
          $.each(_this.selectorMappings, function(selector, fn) {
            if (child.is(selector)) _this.handleMatch(child, fn, scope);
          });

          _this.traverseChildren(child, scope, data);
        }
      });
    },

    liftDeclarations: function(currentNode, scope) {
      var _this = this;

      currentNode.children().each(function(i) {
        var child = $(this);

        // If the child is a declaration, add it to the symbol table.
        if (child.is(_this.declarationSelector)) {
          var symbolName = _this.getSymbolName(child);
          scope.set(symbolName, child);
        }

        // We only traverse down if the child does not signify a new
        // lexical scope.
        if (!child.is(_this.scopeSelector)) _this.liftDeclarations(child, scope);
      });
    },

    run: function(ast, data) {
      this.runWithScopeNode(ast, new Scope(), data);
    }
  });
}(jQuery);