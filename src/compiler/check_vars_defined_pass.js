!function($) {
  var CheckVarsDefinedPass = klass(pass, pass.ScopedTransformer, {
    initialize: function CheckVarsDefinedPass() {
      pass.ScopedTransformer.prototype.initialize.call(this, {
        'identifier_reference': this.onIdentifier,
        'member_identifier': this.onMemberIdentifier,
        'accessor_variable': this.onAccessorVariable,
        'property_access': this.onPropertyAccess
      });
    },

    onDeclaration: function(symbolName, declaration, scope) {
      // We don't allow variable shadowing except for closure params.
      var shadowsVariable = scope.hasSymbol(symbolName) && !declaration.is('closure_parameter');
      var shadowsInstanceDeclaration = scope.classContext
          && scope.classContext.isInContext(symbolName)
          && !declaration.parent().is('auto_set_param');

      if (shadowsVariable || shadowsInstanceDeclaration) {
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
        // If the symbol is not in scope, it can be either a static method/var or an instance
        // method/var.

        if (scope.classContext.isInContext(name)) {
          var declaration = scope.classContext.lookup(name);

          // We leave the static references alone for now.
          if (!(declaration.closest('static_method').size() ||
            declaration.closest('static_var_declaration_statement').size())) {

            return $node('member_identifier', [token], ['name']);
          }
        } else {
          throw new error.ReferenceError(token.attr('line'), name);
        }
      }
    },

    onMemberIdentifier: function(memberIdentifier, scope) {
      var nameToken = memberIdentifier.children('.name');
      var name = nameToken.text();

      if (!scope.context.isInContext(name)) {
        var contextName = scope.context.declaration.children('.name').text();

        throw new error.NotInContextError(nameToken.attr('line'), name, contextName);
      }
    },

    onAccessorVariable: function(accessorVariable, scope) {
      var nameToken = accessorVariable.children('.name');
      var name = nameToken.text();

      if (!scope.classContext.isInContext(name)) {
        var contextName = scope.classContext.declaration.children('.name').text();

        throw new error.InvalidAccessor(nameToken.attr('line'), name);
      }
    },

    onPropertyAccess: function(propertyAccess, scope) {

    }
  });
}(jQuery);