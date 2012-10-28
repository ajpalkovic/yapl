!function($) {
  var CallOrIdentifierTransformer = klass(pass, pass.ScopedTransformer, {
    initialize: function CallOrIdentifierTransformer() {
      pass.ScopedTransformer.prototype.initialize.call(this, {
        'assignment_expression > identifier_reference.left': this.onAssignment,
        'identifier_reference': this.onIdentifier
      });

      this.assignedReferences = {};
    },

    onAssignment: function(identifierReference, scope) {
      var name = identifierReference.children('token').text();
      var value = identifierReference.parent().children('.right');

      this.assignedReferences[name] = value;
    },

    onIdentifier: function(identifierReference, scope) {
      var name = identifierReference.children('token').text();

      // We assume that from the previous stages, the identifier was declared.
      var value = scope.lookup(name);


      // If the symbol is not a function of some sort...
      if (!value.is('function_declaration, function_expression')) {
        var assignedValue = this.assignedReferences[name];

        // Check to see if something was ever assigned to it. If there was, then
        // if the value of the assignment was not some function, we keep it as an identifier.
        // If nothing was ever assigned to it, we assume it is a function.
        if (assignedValue && !assignedValue.is('function_declaration, function_expression')) {
          return identifierReference;
        }
      }

      // We never found where the variable was declared, so we assume
      // it's a function call.
      var parameters = $node('parameters');
      var call = $node('call', [identifierReference, parameters], ['name', 'parameters']);

      return call;
    }
  });
}(jQuery);