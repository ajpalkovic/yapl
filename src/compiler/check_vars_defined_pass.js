!function($) {
  var UNDEFINED = $token(Token.identify('undefined').token);

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

      if (shadowsVariable) {
        var line = declaration.children('.name').attr('line');

        throw new error.ShadowedReference(line, symbolName);
      }
    },

    onInstanceDeclaration: function(symbolName, declaration, scope) {
      var shadowsInstanceDeclaration = scope.classContext
        && scope.classContext.isInContext(symbolName)
        && !declaration.parent().is('auto_set_param');

      if (shadowsInstanceDeclaration) {
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
        if (!scope.classContext.isInContext(name)) {
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
      if (propertyAccess.children('.memberPart').is('property_access')) {
        this.onPropertyAccess(propertyAccess.children('.memberPart'), scope);
      }

      if (propertyAccess.children('.memberPart').is('identifier_reference')) {
        var name = propertyAccess.children('.memberPart').children('token').text();

        // If the symbol wasn't in scope, then one of the other handlers will handle
        // the error.
        if (scope.hasSymbol(scope)) {
          var declaration = scope.lookup(name);

          if (declaration.is('class_declaration')) {
            // TODO: need to be able to check accessor methods.
          }
        }
      }
    }
  });
}(jQuery);