!function($) {
  var CheckVarsDefinedPass = klass(pass, pass.ScopedTransformer, {
    initialize: function CheckVarsDefinedPass() {
      pass.ScopedTransformer.prototype.initialize.call(this, {
        'identifier_reference': this.onIdentifier
      });
    },

    onDeclaration: function(symbolName, declaration, scope) {
      // We don't allow variable shadowing except for closure params.
      if (scope.hasSymbol(symbolName) && !declaration.is('closure_parameter')) {
        var line = declaration.children('.name').attr('line');

        throw new error.ShadowedReference(line, symbolName);
      }
    },

    onIdentifier: function(identifierReference, scope) {
      var token = identifierReference.children('token');
      var name = token.text();

      // If the identifier is a closure alias parameter, then we need to check the parent scope
      // for the declaration, because unlike other variable declarations that are lifted to the
      // top of the scope, we need to make sure this variable declaration aliases another one.
      if (identifierReference.parent().is('closure_parameter')) scope = scope.parentScope;

      if (!scope.hasSymbol(name)) {
        var line = token.attr('line');

        throw new error.ReferenceError(line, name);
      }
    }
  });
}(jQuery);