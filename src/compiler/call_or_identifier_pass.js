!function($) {
  var CallOrIdentifierTransformer = klass(pass, pass.ScopedTransformer, {
    initialize: function CallOrIdentifierTransformer() {
      // what happens if we have something like:
      //    function foo(callback)
      //      callback = 1
      //    end
      //
      //  Naturally, callback should be considered a variable, and we know
      //  that because this transformer bascially does a DFS over the parse
      //  tree that any assignment expression will be handled before its
      //  children.
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
      var assignedValue = this.assignedReferences[name];

      // If the value is a function, or it was assigned to a function at some point in
      // lexical scope, then we can infer that it is a function.
      if (value.is('function_declaration, function_expression') ||
          (assignedValue && assignedValue.is('function_declaration, function_expression'))) {

        var parameters = $node('parameters');
        var call = $node('call', [identifierReference, parameters], ['name', 'parameters']);

        return call;
      }

      // Else we just assume it's an identifier, and the user can resolve the ambiguity
      // by putting explicit '()'s
      return identifierReference;
    }
  });
}(jQuery);