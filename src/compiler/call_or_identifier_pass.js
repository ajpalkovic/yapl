!function($) {
  var CallOrIdentifierTransformer = klass(pass, pass.ScopedTransformer, {
    initialize: function CallOrIdentifierTransformer() {
      pass.ScopedTransformer.prototype.initialize.call(this, {
        'identifier_reference': this.onIdentifier
      });
    },

    onIdentifier: function(identifierReference, scope) {
      var name = identifierReference.children('token').text();

      if (scope.hasSymbol(name)) return identifierReference;

      // We never found where the variable was declared, so we assume
      // it's a function call.
      var parameters = $node('parameters');
      var call = $node('call', [identifierReference, parameters], ['name', 'parameters']);

      return call;
    }
  });
}(jQuery);